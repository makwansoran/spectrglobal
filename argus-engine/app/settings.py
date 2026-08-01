from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    supabase_url: str = ""
    supabase_service_role_key: str = ""

    model_weights: str = "yolo11n.pt"
    infer_device: str = "cpu"  # cpu | cuda
    config_poll_seconds: float = 5.0

    demo_source: str = ""  # local video path for bring-up without DB cameras
    local_evidence_dir: str = "./evidence"
    host: str = "0.0.0.0"
    port: int = 8080

    # Optional OCI — soft-fail if unset
    oci_namespace: str = ""
    oci_bucket: str = ""
    oci_region: str = "eu-amsterdam-1"
    oci_config_file: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
