
ember-cli-rollup
==============================================================================

Build custom rollup bundles with Ember CLI 


Installation
------------------------------------------------------------------------------

```
npm install --save-dev github:Turbo87/ember-cli-rollup
```

Usage
------------------------------------------------------------------------------

This section is using [D3](https://github.com/d3/d3) as an example of how
to build custom bundles for your app.

1.  Install the packages that you want to use via NPM and save them as
    dependencies in your `package.json` file:

    ```
    npm install --save-dev d3-selection d3-scale d3-axis
    ```

2.  Create an entry point file for rollup: `rollup/d3.js` in the root project
    folder (*not* in the `app` folder):

    ```js
    export { scaleLinear, scaleTime } from 'd3-scale';
    export { axisBottom, axisLeft } from 'd3-axis';
    export { select } from 'd3-selection';
    ```

3.  In your `ember-cli-build.js` file adjust `var app = new EmberApp(...)` to
    look roughly like this:

    ```js
    var app = new EmberApp(defaults, {
      'ember-cli-rollup': {
        d3: {
          nodeResolve: {
            jsnext: true,
            main: false,
          },
        },
      },
    });
    ```

    `ember-cli-rollup` will only process modules that are mentioned in this
    options hash. The `nodeResolve` object will be passed as option to the
    [node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)
    rollup plugin.

4.  Use the custom bundle by importing from `rollup/d3` (or using relative
    paths to the entry point file to take advantage of IDE integration)
    
    ```js
    import { scaleLinear } from 'rollup/d3';
    ```


License
------------------------------------------------------------------------------
This project is licensed under the [MIT License](LICENSE.md).
