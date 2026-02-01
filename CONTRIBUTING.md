# Contributing to CivicPulse

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- MongoDB 6.x or higher
- Redis 7.x or higher
- Git

## Getting Started

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CivicPulse.git
   cd CivicPulse
   git remote add upstream https://github.com/codxbrexx/CivicPulse.git
   ```

## Development Setup

### Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civicpulse
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

Start server:
```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start server:
```bash
npm run dev
```

## Project Structure

### Backend
- `src/config/` - Configuration files
- `src/middlewares/` - Express middlewares
- `src/modules/` - Feature modules (auth, issues, reports, etc.)
- `src/sockets/` - WebSocket handlers
- `src/utils/` - Utility functions

### Frontend
- `src/app/` - Redux store configuration
- `src/components/` - Reusable components
- `src/features/` - Redux slices and API integration
- `src/pages/` - Page components
- `src/services/` - API clients

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring

Create a branch:
```bash
git checkout -b feature/your-feature-name
```

Keep your branch updated:
```bash
git fetch upstream
git rebase upstream/main
```

## Coding Standards

### General
- Use TypeScript for all code
- Define proper types and interfaces
- Use meaningful names
- Follow existing code patterns
- Run `npm run lint` before committing

### Backend
- Follow RESTful conventions
- Use async/await
- Implement error handling
- Validate all inputs
- Keep controllers thin, logic in services

### Frontend
- Use functional components with hooks
- Implement prop types
- Keep components focused
- Use Redux for state management
- Follow accessibility best practices
- Use Tailwind CSS for styling

## Commit Guidelines

Follow Conventional Commits format:

```
<type>(<scope>): <subject>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

**Examples:**
```
feat(issues): add severity calculation algorithm
fix(auth): resolve token expiration handling
docs: update setup instructions
```

## Pull Request Process

### Before Submitting

1. Ensure code follows coding standards
2. Run tests and linting
3. Rebase on latest main branch
4. Test changes thoroughly

### Submitting

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a pull request with:
   - Clear description of changes
   - Related issue numbers
   - Screenshots (if UI changes)
   - Testing instructions

### PR Template

```markdown
## Description
Brief description of changes

## Related Issues
Fixes #issue_number

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
How to test these changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests passing
```

## Reporting Issues

### Bug Reports

Include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error messages
- Environment details (OS, browser, Node version)

### Feature Requests

Include:
- Clear description
- Use case and benefits
- Possible implementation approach

### Security Issues

For security vulnerabilities, email maintainers directly rather than opening a public issue.

## License

By contributing to CivicPulse, you agree that your contributions will be licensed under the same license as the project.
