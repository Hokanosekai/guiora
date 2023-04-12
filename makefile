# Makefile for compiling guiora project
# Using cargo
# Usage: make <target> [lib=1, release=1]

PROG_NAME = guiora
OUTPUT_DIR = bin
TARGET_DIR = target
FLAG = debug

lib ?= 0
release ?= 0

ifeq ($(lib), 1)
	OUTPUT_NAME = lib$(PROG_NAME).so
	TARGET = lib
else
	OUTPUT_NAME = $(PROG_NAME)
	TARGET = bins
endif

ifeq ($(release), 1)
	FLAG = release
else
	FLAG = debug
endif

# Cargo
build:
	@echo "Building $(OUTPUT_NAME)..."
	cargo build --$(TARGET) --$(FLAG)

# Installation
install:
	@echo "Installing $(OUTPUT_NAME)..."
	mkdir -p $(OUTPUT_DIR)
	cp $(TARGET_DIR)/$(FLAG)/$(OUTPUT_NAME) $(OUTPUT_DIR)

# Compiler
all: build install

# Clean
clean:
	@echo "Cleaning..."
	rm -rf $(OUTPUT_DIR)
	cargo clean

# Help
help:
	@echo "Targets:"
	@echo "  build: Build the project"
	@echo "Usage: make <target> [lib=1, release=1]"
	@echo "  install: Install the project"
	@echo "  all: Build and install the project"
	@echo "  clean: Clean the project"
	@echo "  help: Show this help"