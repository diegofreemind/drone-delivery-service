# Drone Delivery Service

## Project dependencies and tooling

https://github.com/nvm-sh/nvm

- [nodejs - v16.15.0](https://nodejs.org/en/blog/release/v16.15.0/)
- [yarn - v1.22.18](https://github.com/yarnpkg/yarn/releases)

This project has been written in Visual Studio Code v1.68.1

<br/>

## Build the application

Generates and execute as package

- `./build.sh`

  If you get into not authorized permissions with above command
  you need to authorize it as executable by running `chmod +x .build.sh`.

- `drone-delivery execute`
- `drone-delivery execute {inputPath} {outputPath}` - ( optional custom paths )

The default path for output is located at the root of the project

<br/>

### Approach

- The object oriented design was chosen to model this use case;
- The test driven development was adopted as development practice;
- The versioning strategy adopted was git flow;
- The single responsability principle is applied in components and their functions;
- The useCases and entities implements the required business rules;
- The shared resources expose interfaces and common utilities;

<br/>

### Algorithm

The `DeliveryUseCase` implements the main algorithm:

`calculateTrips`

- handle the required trips based on quantity of locations.

`calculateDeliveries`

- sorts the drone squad based on higher weight capacity;
- sorts the locations collection from lower to higher weight;
- iterate over unallocated locations subset for next drone available;

`matchLocationsByDrone`

- find the subset of locations for next drone with higher weight capacity aiming the lowest idle capacity.

<br/>

### Executing the application in development

To run with default files path ( application root path )

- `yarn run start execute`

To run with custom files path ( relative paths )

- `yarn run start execute {inputPath} {outputPath}`

### Executing the tests

- `yarn run test`

### Lint and Format

- `yarn run lint`
- `yarn run format`
