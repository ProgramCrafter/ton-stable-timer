# Rift Bare Template
This repository serves as a barebones project template with the Rift framework. It includes minimal examples of development, testing, and deployment.

## Initializing the Project
To start a new project, you have two options:

1. Use this template directly through GitHub's interface by clicking the Use this template button and cloning your project.
2. Use the rift command:
```bash
rift init my-project
```
This will initialize a new project in the `my-project` directory.

## Building the Project
To build the project, run the following command (replace `TARGET` with the target contract or `all` to build the entire project):
```bash
rift build TARGET
```

## Testing
To run tests on a `TARGET` contract, use the following command:
```bash
rift test TARGET
```

## Deployment
To deploy your `TARGET` contract, use the following command:
```bash
rift deploy TARGET
```
