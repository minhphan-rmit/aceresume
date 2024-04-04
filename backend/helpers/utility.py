# -*- coding: utf-8 -*-
"""Holding utility stuff"""
from __future__ import annotations

import asyncio
import contextvars
import inspect
import logging
import math
import pathlib
import re
import json
import time
import traceback
import zipfile
import html
import unicodedata
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from contextlib import suppress
from functools import lru_cache, partial, wraps
from typing import Any, Callable, Coroutine, DefaultDict, Iterable

# from data_models.paging import Paging
from fastapi import (  # Need Request from fastapi this, otherwise errors will be raised when inspecting.
    Request,  # noqa: F401
    UploadFile,  # noqa: F401
)
from loguru import logger
from pydantic import BaseModel
from starlette.responses import JSONResponse
from constant import Constants

SIZE_NAME = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
REGEX_CAPITALIZED = re.compile(r"[A-Z]+")
REGEX_TO_SNAKE_CASE = re.compile(r"([^A-Z]+)([A-Z]+)")
REGEX_PAGE_COUNT = re.compile(r"/Type\s*/Page([^s]|$)", re.MULTILINE | re.DOTALL)


class PoolManager:
    """A manager for ThreadPoolExecutor."""

    logger = logging.getLogger("PoolManager")

    def __init__(self):
        self.pools: dict[str, ThreadPoolExecutor] = {}
        self.logger.debug("Initialized")

    def initialize(self, name: str, max_workers: int | None = None):
        """Create and initialize a ThreadPoolExecutor.

        Arguments:
        -----------
        name: :class:`str`
        """
        if name not in self.pools:
            self.pools[name] = ThreadPoolExecutor(
                thread_name_prefix=name,
                max_workers=max_workers,
            )
            self.logger.info(
                "Initialized pool %r, %s workers",
                name,
                self.pools[name]._max_workers,
            )

    async def unblock(
        self,
        name: str,
        func,
        *args,
        max_workers: int | None = None,
        **kwargs,
    ):
        """Submit work to a ThreadPoolExecutor via name, and asynchronously run function *func* in a separate thread.

        Any *args and **kwargs supplied for this function are directly passed to *func*. Also, the current
        :class:`contextvars.Context` is propagated, allowing context variables from the main thread to be accessed in
        the separate thread.

        Return a coroutine that can be awaited to get the eventual result of *func*.

        Note: this is a clone of asyncio.to_thread, with the added ability to specify what executor to run on. The name
        is unblock for legacy reasons to make transitioning easier.

        In the context of discord.py, we use this to prevent long-running operations from blocking other functionality
        including commands and the bot's heartbeat.

        Arguments:
        -----------
        name: :class:`str`
        func: :class:`Callable`

        Returns:
        -----------
        :class:`Any`
        """
        self.initialize(name, max_workers=max_workers)
        loop = asyncio.get_event_loop()
        ctx = contextvars.copy_context()
        func_call = partial(ctx.run, func, *args, **kwargs)
        results = await loop.run_in_executor(self.pools[name], func_call)
        return results

    def shutdown(self, name: str):
        """Shutdown a ThreadPoolExecutor via name.

        Arguments:
        -----------
        name: :class:`str`
        """
        if not (pool := self.pools.pop(name, None)):
            return

        pool.shutdown(wait=False, cancel_futures=True)
        self.logger.info("Pool %r shutdown", name)

    def shutdown_all(self):
        """Shutdown all pool."""
        for name, pool in self.pools.items():
            pool.shutdown(wait=False, cancel_futures=True)
            self.logger.info("Pool %r shutdown", name)
        self.pools.clear()


class Utility:
    """Simple class for simple utilities"""

    __slots__ = ()

    logger = logging.getLogger("Utility")
    pool = PoolManager()

    @staticmethod
    async def unblock(
        func: Callable,
        *args,
        pool_name: str = "Utility",
        max_workers: int | None = None,
        **kwargs,
    ) -> Any:
        """Asynchronously run function *func* in a separate thread. See `PoolManager.submit()` for more info."""
        return await Utility.pool.unblock(
            pool_name,
            func,
            *args,
            **kwargs,
            max_workers=max_workers,
        )

    @staticmethod
    def unblock_custom(name: str, max_workers: int | None = None):
        """Creates a partial function for unblock that defaults to the given thread pool."""
        return partial(Utility.unblock, pool_name=name, max_workers=max_workers)

    @staticmethod
    def shutdown_pool(name: str):
        """Unblock synchronously blocking function."""
        Utility.pool.shutdown(name)

    @staticmethod
    async def parallel_async(tasks: Iterable, pool_name: str = "Utility"):
        """Run tasks in parallel."""
        coroutines: list[Coroutine] = []
        for func, *args in tasks:
            kwargs = {}
            with suppress(TypeError, IndexError):
                kwargs.update(args[-1])
                args = args[:-1]
            coroutines.append(Utility.pool.unblock(pool_name, func, *args, **kwargs))
        return await asyncio.gather(*coroutines, return_exceptions=False)

    @staticmethod
    def find_first(data: list[Any], match: Callable[[Any], bool]) -> tuple[int, Any]:
        """
        Given a list and a function that returns true for a match in the list, finds the first object
        in the list that matches and returns the index as well as the object.

        Arguments:
        -----------
        data: list[:class:`Any`]
            list of things to search through
        match: Callable[[:class:`Any`], :class:`bool`]
            Lambda that given an object, returns True for a match

        Returns:
        -----------
        tuple[:class:`int`, :class:`Any`]
            The index and object matched, else -1 and None if no match
        """
        return next(
            ((index, item) for index, item in enumerate(data) if match(item)),
            (-1, None),
        )

    @staticmethod
    def search_for(collection: list | dict, **kwargs) -> list:
        results = []
        try:
            kwargs_items = kwargs.items()
            for item in collection:
                if isinstance(item, list):
                    result = Utility.search_for(item, **kwargs)
                    if result:
                        results.append(result)
                elif isinstance(item, dict) and all(
                    item.get(k, None) == v for k, v in kwargs_items
                ):
                    results.append(item)
                elif all(getattr(item, k, None) == v for k, v in kwargs_items):
                    results.append(item)
        except Exception as error:  # pylint: disable=broad-except
            Utility.logger.exception(Utility.format_exception(error))
        return results

    @staticmethod
    def format_exception(error: Exception) -> str:
        try:
            return "".join(
                traceback.format_exception(type(error), error, error.__traceback__),
            )
        except Exception as _error:  # pylint: disable=broad-except
            Utility.logger.exception(Utility.format_exception(_error))
            return error.__traceback__

    @staticmethod
    def convert_size(size_bytes) -> str:
        """Convert a size in bytes."""
        if size_bytes == 0:
            return "0B"
        i = int(math.floor(math.log(size_bytes, 1024)))
        p = math.pow(1024, i)
        s = round(size_bytes / p, 2)
        return f"{s} {SIZE_NAME[i]}"

    @staticmethod
    def to_camel(data: list | dict) -> dict | list:
        """
        Turning all keys to camelCase to comply with FE.

        Args:
            data (dict): The data in question, can be a child of Base / an object from pymongo.

        Returns:
            dict: The data whose keys have been camelCased.
        """
        if isinstance(data, (list, tuple)):
            return list(map(Utility.to_camel, data))

        if not isinstance(data, dict):
            # Can be str int etc, return it raw.
            return data

        return {
            Utility.camel_case(key): Utility.to_camel(value)
            for key, value in data.items()
        }

    @staticmethod
    def to_snake_case(text: str) -> str:
        """Turn a camelCase into snake_case."""
        return REGEX_TO_SNAKE_CASE.sub(r"\1_\2", text).lower()

    @staticmethod
    @lru_cache(maxsize=2048)
    def camel_case(text: str) -> str:
        """Convert snake_case to camelCase."""
        text_cleaned = re.sub(pattern=r"[ \(\)\{\}\[\]-]+", repl="_", string=text)
        first, *rest = text_cleaned.split("_")
        return f"{first.lower()}{''.join(map(str.capitalize, rest))}"

    @staticmethod
    def group_by_non_contiguous(
        iterable: Iterable,
        key: Callable,
    ) -> DefaultDict[str, list[Any]]:
        results = defaultdict(list)
        for item in iterable:
            results[key(item)].append(item)
        return results

    @staticmethod
    def undo_camel_case(text: str) -> str:
        """Convert camelCase back to normal case."""
        return REGEX_CAPITALIZED.sub(lambda m: f" {m.group().lower()}", text)

    @staticmethod
    @lru_cache
    # async def embed_async(list_str: list[str]):
    #    task = [Utility.unblock(Utility.embed_sync, text) for text in list_str]

    #    return await asyncio.gather(*task)

    async def embed_async(list_str: list[str]):
        return await Constants.EMBEDDING_FUNC.aembed_documents(list_str)

    @staticmethod
    @lru_cache
    def embed_sync(text: str):
        return Constants.EMBEDDING_FUNC.embed_documents(text)

    @staticmethod
    @lru_cache
    async def normalize_text_async(list_of_text: str):
        task = [
            Utility.unblock(Utility.normalize_text_sync, text) for text in list_of_text
        ]

        return await asyncio.gather(*task)

    @staticmethod
    def safe_file_read(file_path: str, is_json: bool = False) -> Any:
        """Safely reads a file's content, optionally parsing it as JSON."""
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                return json.load(file) if is_json else file.read()
        except FileNotFoundError as e:
            logger.error(f"File not found: {file_path}, error: {e}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON from {file_path}: {e}")
            raise
        except IOError as e:  # Catching any other IO-related errors
            logger.error(f"IO error reading file {file_path}: {e}")
            raise

    @staticmethod
    def deep_normalize_text(text: str) -> str:
        """Normalizes text by lowercasing, handling HTML entities, and removing non-alphanumeric characters, while preserving important textual information."""
        # Normalize Unicode characters to ensure consistency
        text = unicodedata.normalize("NFKC", text)
        # Lowercase the text
        text = text.lower()
        # Decode HTML entities
        text = html.unescape(text)
        # Remove HTML tags
        text = re.sub(r"<[^>]+>", "", text)
        # Replace URLs with a placeholder or remove
        text = re.sub(r"http\S+", "url", text)
        # Replace numbers with a placeholder or remove
        text = re.sub(r"\d+", "number", text)
        # Optionally: Replace or remove email addresses
        text = re.sub(r"\S+@\S+", "email", text)
        # Remove non-alphanumeric characters while preserving intra-word dashes
        text = re.sub(
            r"\b(-\w+|\w+-)\b", "hyphenated", text
        )  # Placeholder for hyphenated words
        text = re.sub(r"[^\w\s-]", "", text)
        text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces

        # Tokenize and remove stopwords
        # stopwords_set = set(stopwords.words("english"))
        # filtered_words = [word for word in tokens if word not in stopwords_set]

        return text

    @staticmethod
    def unzip_all(folder: str) -> None:
        """Unzip all files in a folder.

        Arguments:
        -----------
        folder: :class:`str`
        """
        for path in pathlib.Path(folder).glob("*.zip"):
            Utility.unzip_single(folder, path)

    @staticmethod
    async def unzip_all_async(folder: str) -> None:
        """Unzip all files in a folder.

        Arguments:
        -----------
        folder: :class:`str`
        """
        tasks = [
            Utility.unblock(Utility.unzip_single, folder, path)
            for path in pathlib.Path(folder).glob("*.zip")
        ]
        await asyncio.gather(*tasks)

    @staticmethod
    def unzip_single(folder: str, path: pathlib.Path) -> None:
        """Unzip all files in a folder.

        Arguments:
        -----------
        folder: :class:`str`
        """
        with zipfile.ZipFile(path, "r") as file:
            file.extractall(folder)
        path.unlink(missing_ok=True)

    @staticmethod
    def measure_runtime(func):
        """Measure how much time a function run."""
        source = inspect.getsourcefile(func) or "unknown"
        f = logger.catch()(func)
        filename = source.strip(".py").rsplit("\\")[-1].title()
        local_logger = logging.getLogger(filename)

        def pre_run():
            started = time.perf_counter()
            local_logger.debug(func.__name__)
            return started

        def post_run(started):
            time_consumed = time.perf_counter() - started

            logging_method = None
            if time_consumed >= 5:
                logging_method = local_logger.critical
            elif time_consumed >= 1:
                logging_method = local_logger.warning

            if logging_method:
                logging_method("%s - %.2fs", func.__name__, time_consumed)

        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                started = pre_run()
                response = f(*args, **kwargs)
                post_run(started)
                return response
            except Exception as error:  # pylint: disable=broad-except
                local_logger.error(Utility.format_exception(error))
                return JSONResponse(status_code=500, content={"message": str(error)})

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            try:
                started = pre_run()
                response = await f(*args, **kwargs)
                post_run(started)
                return response
            except Exception as error:  # pylint: disable=broad-except
                local_logger.error(Utility.format_exception(error))
                return JSONResponse(status_code=500, content={"message": str(error)})

        return async_wrapper if inspect.iscoroutinefunction(func) else wrapper

    @staticmethod
    def async_now(func=None, executor=None):
        def wrapper(f):
            @wraps(f)
            async def _inner(*args, **kwargs):
                loop = asyncio.get_event_loop()
                return await loop.run_in_executor(executor, f, *args, **kwargs)

            return _inner

        return wrapper(func) if func else wrapper

    class Singleton(type):
        """A singleton class."""

        _instances = {}

        def __call__(cls, *args, **kwargs):
            if cls not in cls._instances:
                cls._instances[cls] = super().__call__(*args, **kwargs)
            return cls._instances[cls]


class CamelCaseModel(BaseModel):
    class Config:
        alias_generator = Utility.camel_case
        populate_by_name = True
