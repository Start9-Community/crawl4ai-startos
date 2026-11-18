ARCHES := x86 arm
# overrides to s9pk.mk must precede the include statement
include node_modules/@start9labs/start-sdk/s9pk.mk

TEST_IMAGE ?= crawl4ai-startos:runtime-test
TEST_PLATFORM ?= linux/amd64
.PHONY: test-runtime
test-runtime:
	docker run --rm -i --network none --platform $(TEST_PLATFORM) --entrypoint python $(TEST_IMAGE) - $(TEST_ARGS) < tests/runtime.py
