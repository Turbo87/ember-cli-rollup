/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-rollup',

  included: function(app) {
    var options = this.app.options['ember-cli-rollup'];
    var modules = Object.keys(options);

    modules.forEach(function(module) {
      app.import('vendor/rollup/' + module + '.js');
    });
  },

  treeForVendor: function(tree) {
    // require() lazily for faster CLI boot-up time
    var path = require('path');
    var WatchedDir = require('broccoli-source').WatchedDir;
    var Rollup = require('broccoli-rollup');
    var mergeTrees = require('broccoli-merge-trees');

    // read list of rollup modules
    var options = this.app.options['ember-cli-rollup'];
    var modules = Object.keys(options);

    // prepare list of vendor trees
    var trees = [];
    if (tree) {
      trees.push(tree);
    }

    // watch the `rollup` folder in the project
    var root = this.project.root;
    var rollupFolder = path.join(root, 'rollup');
    var rollupTree = new WatchedDir(rollupFolder);

    // iterate over rollup modules
    modules.forEach(function(module) {
      var moduleOptions = options[module];

      // apply `node-resolve` rollup plugin unless specifically disabled
      var rollupPlugins = [];
      if (!moduleOptions.nodeResolve || moduleOptions.nodeResolve.disabled !== true) {
        var nodeResolve = require('rollup-plugin-node-resolve');
        rollupPlugins.push(nodeResolve(moduleOptions.nodeResolve));
      }

      // create rollup tree for the module
      var moduleTree = new Rollup(rollupTree, {
        rollup: {
          entry: module + '.js',
          dest: 'rollup/' + module + '.js',
          format: 'amd',
          moduleId: 'rollup/' + module,
          sourceMap: true,
          plugins: rollupPlugins
        }
      });

      trees.push(moduleTree);
    });

    return mergeTrees(trees, {
      annotation: 'TreeMerger (ember-cli-rollup)',
    });
  },
};
