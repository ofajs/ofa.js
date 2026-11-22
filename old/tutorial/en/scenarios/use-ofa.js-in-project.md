# Using AI Prompt Words of ofa.js in Projects

Since ofa.js is not yet a widely known framework, mainstream AI models do not yet have the ability to directly use ofa.js. To this end, we have carefully prepared dedicated prompts to help AI learn and reference how to use ofa.js.

We provide two versions of the prompt:

## Simplified version of the prompt

This is a condensed and optimized version, designed to minimize front-loaded token input consumption, suitable for most scenarios:

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/tiny/start.md
```

Using this prompt, AI can efficiently develop components or page modules of ofa.js.

## Complete Version Prompt Words

If the AI model you are using is relatively less intelligent, you can try using the unabridged full version of the prompt. Although it will consume more tokens during initialization, it may yield better results:

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/origin/start.md
```

By providing these prompts, we aim to help developers more conveniently leverage AI tools for ofa.js project development and improve development efficiency.

