---
trigger: always_on
alwaysApply: true
---

# **tutorit: Git Development Workflow >> MUST FOLLOW EVERY CONVERSATION MADE**

## 1. Objective

This document provides a mandatory set of rules for Git repository management for the **tutorit** React TypeScript project. The primary goal is to enforce a strict, systematic, and traceable workflow for all code changes. Every feature, fix, configuration change, or piece of documentation must be developed in an isolated branch and integrated into the `main` branch only through a Pull Request (PR).

While there isn't a direct equivalent to Python's `virtualenv` in Node.js for managing project-specific interpreter and library versions, Node.js projects typically manage dependencies on a per-project basis through the `node_modules` directory and the `package.json` file. Tools like `nvm` (Node Version Manager) can be used to manage different versions of Node.js itself. For the purposes of this workflow, we will assume that the appropriate Node.js version is active in your development environment.

## 2. Core Principles

- **Isolation**: Each distinct task must be performed on its own dedicated branch. Never commit unrelated changes to the same branch.
- **Traceability**: Branch names and commit messages must be structured and descriptive, allowing for a clear and understandable project history.
- **Integration via Review**: The `main` branch is protected. All changes must be merged into `main` through a Pull Request, ensuring a point of review and quality control.
- **Synchronization**: Your local `main` branch must always be synchronized with the remote `origin/main` before starting any new work.

## 3. Branch Naming Convention

All branches must adhere to the following structure:

**Format:** `<type>/<scope>/<short_description>`

---

### **Component Definitions:**

#### **`<type>`** (Mandatory)

This defines the purpose of the branch. It must be one of the following keywords:

- **`feature`**: For adding a new feature or functionality (e.g., creating a new component, adding a new page or service).
- **`setup`**: For initial project or feature setup and configuration (e.g., setting up the React project, adding `.gitignore`, configuring `tsconfig.json`).
- **`fix`**: For bug fixes that correct unintended behavior.
- **`docs`**: For changes to documentation only (e.g., updating `README.md`, adding code comments).
- **`style`**: For code style changes that do not affect logic (e.g., formatting, linting).
- **`refactor`**: For code changes that neither fix a bug nor add a feature, but improve its structure or performance.
- **`test`**: For adding or modifying tests.
- **`tech`**: For technical tasks (e.g., library upgrades, tooling).

#### **`<scope>`** (Mandatory)

This defines the module, component, or area of the application affected by the changes.

- Use the component name in PascalCase (e.g., `UserProfile`, `ProductCard`).
- Use a relevant directory name for broader changes (e.g., `hooks`, `services`, `pages`).
- Use `project` for project-wide changes (e.g., configuring `tsconfig.json`, root routing files).
- Use `git` for repository-level changes (e.g., `.gitignore`).

#### **`<short_description>`** (Mandatory)

A brief, hyphenated (`kebab-case`) description of the task.

- Use verbs (e.g., `create-component`, `add-user-authentication`, `configure-routing`).
- Keep it concise but clear.

---

### **Task Type Prefix**

- Technical Task: `tech`
- Feature: `feature`
- Bug Fix: `fix`
- Setup: `setup`

### **Examples of Valid Branch Names:**

- `setup/project/initialize-react-app`
- `feature/components/create-user-profile-component`
- `feature/services/add-authentication-service`
- `fix/pages/resolve-login-form-bug`
- `tech/routing/update-react-router-config`

## 4. Commit Message Convention

All commit messages must follow the Conventional Commits specification.

**Format:** `<type>(<scope>): <description>`

---

### **Component Definitions:**

#### **`<type>`** (Mandatory)

Use the **same keywords** as defined in the branch naming convention (`feature`, `setup`, `fix`, etc.). The commit `type` must align with the branch `type`.

#### **`<scope>`** (Mandatory)

Use the **same scope** as defined in the branch naming convention (`UserProfile`, `project`, etc.). The commit `scope` must align with the branch `scope`.

#### **`<description>`** (Mandatory)

- A concise summary of the change in the **imperative mood** (e.g., "add," "fix," "update," not "added," "fixed," "updated").
- Starts with a lowercase letter.
- Does not end with a period.

---

### **Examples of Valid Commit Messages:**

- `setup(git): add gitignore file`
- `setup(project): create the react typescript project`
- `feature(components): create UserProfile component`
- `feature(services): setup settings for the authentication service`
- `fix(components): prevent duplicate form submissions`

## 5. The Standard Workflow Loop

This exact sequence **must be followed for every single task**, no matter how small.

---

**Command Prompt Rules:**

### Do not use (for example)

```bash
cd tutorit && npm start
```

### Instead, use

```bash
cd tutorit; npm start
```

**Scenario:** You need to perform a task, such as adding a new component to the `tutorit` application.

**Step 1: Synchronize Local `main` Branch**

Before starting anything new, ensure your local `main` is up-to-date with the remote repository.

```bash
git checkout main
git pull origin main
```
 