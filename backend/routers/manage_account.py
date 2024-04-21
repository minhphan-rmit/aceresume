# -*- coding: utf-8 -*-
from constant import Constants
from datetime import datetime, timedelta


def delete_inactive_accounts():
    # Calculate the threshold time for deletion (24 hours ago)
    threshold_time = datetime.utcnow() - timedelta(hours=24)

    # Delete inactive accounts that were registered more than 24 hours ago and are not activated
    result = Constants.USERS.delete_many(
        {"created_at": {"$lt": threshold_time}, "is_activate": False}
    )

    # Print the number of deleted documents
    print(f"Deleted {result.deleted_count} inactive accounts.")
