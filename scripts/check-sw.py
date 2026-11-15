#!/usr/bin/env python3
"""Check service worker precache list and cache version."""

import re
import sys
from pathlib import Path

def main():
    sw_path = Path("sw.js")
    if not sw_path.exists():
        print("FAIL: sw.js not found")
        return 1
    
    sw_content = sw_path.read_text(encoding="utf-8")
    
    # Extract CACHE constant
    cache_match = re.search(r"const CACHE = '([^']+)'", sw_content)
    if not cache_match:
        print("FAIL: CACHE constant not found")
        return 1
    
    cache_name = cache_match.group(1)
    
    # Verify CACHE matches beijing101-v<N> pattern
    cache_match_pattern = re.match(r"beijing101-v(\d+)", cache_name)
    if not cache_match_pattern:
        print(f"FAIL: CACHE '{cache_name}' does not match 'beijing101-v<N>' pattern")
        return 1
    
    cache_version = int(cache_match_pattern.group(1))
    if cache_version <= 9:
        print(f"FAIL: CACHE version {cache_version} is not greater than 9")
        return 1
    
    # Extract ASSETS array
    assets_match = re.search(r"const ASSETS = \[(.*?)\];", sw_content, re.DOTALL)
    if not assets_match:
        print("FAIL: ASSETS array not found")
        return 1
    
    assets_content = assets_match.group(1)
    
    # Parse the assets array lines
    assets_lines = [line.strip().strip("',") for line in assets_content.split("\n") if line.strip()]
    assets = [line for line in assets_lines if line]
    
    # Check that required files are in ASSETS (according to the task description)
    # Based on sw.js, these are the files that should be in ASSETS:
    required_files = [
        "./index.html",
        "./manifest.webmanifest", 
        "./data/lessons.js",
        "./icon-192.png",
        "./icon-512.png"
    ]
    
    # Check that all required files are listed in ASSETS
    missing_required = []
    for req_file in required_files:
        if req_file not in assets:
            missing_required.append(req_file)
    
    if missing_required:
        print(f"FAIL: Required files missing from ASSETS: {missing_required}")
        return 1
    
    # Check that all assets exist on disk
    missing_assets = []
    base_path = Path(".")
    
    for asset in assets:
        # Handle relative paths
        if asset.startswith("./"):
            asset_path = base_path / asset[2:]
        else:
            asset_path = base_path / asset
            
        if not asset_path.exists():
            missing_assets.append(asset)
    
    if missing_assets:
        print(f"FAIL: Missing assets: {missing_assets}")
        return 1
    
    print("PASS: All checks passed")
    return 0

if __name__ == "__main__":
    sys.exit(main())