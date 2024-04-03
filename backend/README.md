# AceResume Backend

## __Setup__

### __Local Setup__

``` python
git clone https://github.com/minhphan-rmit/rmit2024a-isys2101-aceresume.git

# either using conda, venv or env
conda create --name ace-resume python=3.11
conda activate ace-resume
cd backend
touch .env # copy the env format from the .env.example. For specific key, please refer to the team

# install requirement packages
pip install -r requirements-dev.txt

# setup pre-commit
# this will overlapse your commit when you run git commit. Just need to rerun the commit process again should be fine
pre-commit install
pre-commit run --all-files

# run fastapi docs page
uvicorn main:app --reload
# open http://0.0.0.0:8080/api/aceresume/docs
```

### __Docker Setup__

``` python
TBA
```
