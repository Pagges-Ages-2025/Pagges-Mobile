# Pagges Mobile

Pagges mobile repository

## Dependency Installation

- Install [Expo GO](https://expo.dev/go) on your mobile device;

- Install [Node.js](https://nodejs.org/en);

- Install [VSCode](https://code.visualstudio.com/);

- Install the `Prettier` extension in VSCode;

- Install the `ES7+ React/Redux/React-Native` snippets extension in VSCode.

## Clone the Repository

- Create a folder for the repository;

- Open a terminal inside the folder and clone the repository:
  ```bash
  git clone https://tools.ages.pucrs.br/pagges/pagges-mobile.git
  ```

## How to Run the Project?

1. Navigate to the `pagges-mobile` folder:

2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Start the project:

   ```bash
   npm run start
   ```

4. Scan the QR Code with your phone.
   - On Android, use **Expo Go > Scan QR**.
   - On iOS, use the default camera app.

#ESLint

## Required Extensions

- Install the `ESLint` extension in VSCode

## How to Run ESLint

1. To check for linting errors in your code:

   ```bash
   npx eslint path/to/file
   ```

   So if you want to run the ESLint for the entire project you can run from root:

   ```bash
   npx eslint app
   ```

2. To automatically fix linting errors:

   ```bash
   npx eslint --fix
   ```

Note: ESLint will automatically run when you save files if you have the ESLint extension installed in VSCode.

# Prettier

## Required Extensions

- Install the `Prettier` extension in VSCode

- Open the Command Pallete (Ctrl + Shift + P) and search for "Preferences: Open User Settings (JSON)"

- Enable "Format on Save" in your VSCode by adding this to the settings:

{
...
"editor.formatOnSave": true,
"editor.defaultFormatter": "esbenp.prettier-vscode"
}

Now Prettier will automatically format your code when you save files (Ctrl + S) if you have the Prettier extension installed in VSCode.

# Branch Naming Convention

## Format

### Types:

- `feature/` → For new features
- `fix/` → For bug fixes
- `refactor/` → For code refactoring or improvements

### Examples:

- `feature/US-01-login-page`
- `fix/US-02-login-error`
- `refactor/US-03-optimize-api-calls`

### Rules:

1. **US-XX**: Represents the user story or issue number.
2. **SHORT-NAME**: A concise description of the feature, fix, or refactor.
3. **Use lowercase** for the short name and separate words with hyphens (`-`).
4. **Keep it short and meaningful**.

This ensures consistency across branches and makes it easier to track work in progress.

# Commit Message Conventions

- The `<TYPE>` defines the purpose of the commit.
- The `<Short description>` should be concise and written in **present tense** (e.g., "add login validation" instead of "added login validation").

---

## Commit Types:

- **feat**: A new feature  
  _Example:_ `feat: add user profile page`
- **fix**: A bug fix  
  _Example:_ `fix: resolve login validation error`
- **refactor**: Code restructuring without changing behavior  
  _Example:_ `refactor: improve authentication logic`
- **docs**: Documentation updates  
  _Example:_ `docs: update README with setup instructions`
- **style**: Code style changes (formatting, missing semicolons, etc.), no functional changes  
  _Example:_ `style: fix indentation in settings component`
- **test**: Adding or updating tests  
  _Example:_ `test: add unit tests for login service`
- **chore**: Maintenance tasks, dependency updates, or build process changes  
  _Example:_ `chore: update eslint dependencies`
- **perf**: Performance improvements  
  _Example:_ `perf: optimize database query for faster response time`
- **ci**: Continuous integration updates  
  _Example:_ `ci: add GitHub Actions workflow for testing`
- **build**: Changes that affect the build system or external dependencies  
  _Example:_ `build: upgrade Webpack to version 5`

---

## Additional Guidelines:

1. **Use lowercase** for commit types.
2. **Keep descriptions concise** but meaningful.
3. **Use imperative mood** (_"fix issue"_, not _"fixed issue"_).
4. **Reference issues if applicable** (e.g., `fix: resolve login issue (#123)`).
5. **Use multiple types when needed**  
   _Example:_ `feat(auth): add JWT token refresh`
