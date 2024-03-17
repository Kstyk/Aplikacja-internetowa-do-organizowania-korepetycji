from storages.backends.azure_storage import AzureStorage
from .settings_local import STORAGE_ACCOUNT_KEY, AZURE_ACCOUNT_NAME


class AzureMediaStorage(AzureStorage):
    # Must be replaced by your <storage_account_name>
    account_name = AZURE_ACCOUNT_NAME
    account_key = STORAGE_ACCOUNT_KEY
    azure_container = 'media'
    expiration_secs = None


class AzureStaticStorage(AzureStorage):
    # Must be replaced by your storage_account_name
    account_name = AZURE_ACCOUNT_NAME
    account_key = STORAGE_ACCOUNT_KEY
    azure_container = 'static'
    expiration_secs = None
