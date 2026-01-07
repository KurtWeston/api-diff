# api-diff

Compare JSON API responses to detect structural changes, type mismatches, and breaking changes

## Features

- Deep comparison of two JSON objects or files
- Detect added fields (present in new, missing in old)
- Detect removed fields (present in old, missing in new)
- Detect changed values with before/after display
- Detect type changes (e.g., string became number, object became array)
- Color-coded terminal output (green for added, red for removed, yellow for changed)
- Support for reading from files or stdin
- Support for fetching from URLs directly
- Ignore specific paths using dot notation (e.g., 'user.id', 'metadata.timestamp')
- Multiple output formats: pretty (default), compact, JSON
- Exit code 0 if identical, 1 if differences found
- Summary statistics (total changes, additions, removals)
- Nested object and array comparison with path tracking
- Handle null, undefined, and missing field distinctions

## How to Use

Use this project when you need to:

- Quickly solve problems related to api-diff
- Integrate typescript functionality into your workflow
- Learn how typescript handles common patterns

## Installation

```bash
# Clone the repository
git clone https://github.com/KurtWeston/api-diff.git
cd api-diff

# Install dependencies
npm install
```

## Usage

```bash
npm start
```

## Built With

- typescript

## Dependencies

- `commander`
- `chalk`
- `deep-diff`
- `json-diff`
- `typescript`
- `vitest`
- `@types/node`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
