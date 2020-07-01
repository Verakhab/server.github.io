const presets = [
    [
        "@babel/env",
        {
            targets: { 
                    edge: "17",
                    firefox: "50",
                    chrome: "64",
                    safari: "11.1",
                    esmodules: true,
                    ie: "11"
            },
            useBuiltIns: "usage",
            corejs: "3.4.1",
        }
    ],
];
  
module.exports = { presets };