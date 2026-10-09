# Introduction

## What is ofa.js？

ofa.js is an easy-to-use Web frontend framework, designed specifically for building Web applications, aiming to improve development efficiency and lower the barrier to entry.

> If you are **already basically familiar** with HTML, CSS, and JavaScript, then ofa.js is a very good choice.

## Why I developed ofa.js

The original design intention of ofa.js is simple: to solve the **engineering** problems of Web development without relying on build tools.

> Engineering refers to the systematic integration of specifications, processes, tools, and methods in the software development process to improve development efficiency, code quality, and maintainability.

Over the past decade, front-end Web development has evolved from its early wild growth to a gradual engineering process. Drawing on the experience of traditional application development, this process has solved the engineering challenges of large-scale projects by introducing Node.js and a compilation workflow.

However, as the project grows, the drawbacks of this pattern gradually surface, and the **monolithic application** problem faced in traditional development emerges, making the project difficult to maintain and iterations of interaction requirements challenging.

> Monolithic Application refers to a large and tightly coupled single application where all functional modules are centralized in a single codebase. A change in one part affects the whole, making it difficult to develop and deploy independently.

At this point, it is necessary to break down the project and implement micro-frontends, much like **microservices**. However, due to compilation processes, micro-frontends become difficult and cumbersome. Independent deployment of frontend modules requires compiling each small module individually, which is very challenging, causing the development of web frontend technology to face near stagnation.

> Microservices is a software architecture style that decomposes large, complex applications into multiple fine-grained, independently deployed and operated small services.

At this point, I began to think: traditional programming languages need to cope with different hardware and operating systems, so they must be compiled to achieve platform-independent uniformity. However, web development is different—it is based on browsers and inherently does not require compilation, can run and deploy independently, and is naturally a micro-frontend pattern. So I realized that it is the compilation process that actually complicates things.

That is to say, as long as the engineering problems are solved, and the necessary step of compilation is removed, front-end development becomes very suitable for developing large applications, and this is the natural micro-frontend pattern. Hence, ofa.js came into being.

## Core Advantages

### Zero threshold, out-of-the-box

No need to set up a development environment, install dependencies, or configure a scaffolding tool—open the official builder in your browser, select a local directory, and start developing right away. All computation, data handling, and storage run locally, with no reliance on cloud services.

### AI-friendly, easy to verify

No compilation black box, AI-generated code can be quickly deployed and self-verified; reducing intermediate layers and skipping the compilation process makes it easier to locate and fix issues in the code.

### Micro Frontend Native Support

ofa.js enables Web front-end development to be split into multiple independent modules, just like micro-services, each of which can be developed and deployed independently. Once the boundaries of traditional Web front-end are broken, front-end technologies will gradually transcend the limitations of server technologies.

## Getting Started

- If you have some development experience, you can start from [script introduction](./script-reference.md).
- If you are a beginner, we recommend starting from [Create your first app](./create-first-app.md).