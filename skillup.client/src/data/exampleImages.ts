// Topic illustrations that already ship inside the client (public/examples).
// Handy when an admin picks an image for a topic.
export const exampleImageGroups: { group: string; files: string[] }[] = [
  {
    group: "HTML",
    files: [
      "basichtml", "tagshtml", "attributeshtml", "listshtml", "tableshtml",
      "linkshtml", "imageshtml", "formshtml", "semantichtml", "semantictagshtml",
      "mediashtml", "accessibilityhtml", "SEOhtml", "microdatahtml", "hphtml",
    ],
  },
  {
    group: "JavaScript",
    files: [
      "variableexamplejs", "operatorsjs", "conditionalsjs", "loopsjs", "functionsjs",
      "arrayjs", "hofjs", "domjs", "poptjs", "promisejs", "asyncjs", "fetchjs",
      "modulesjs", "testingjs", "thisjs", "prototypejs", "bcajs", "datatypesjs",
    ],
  },
  {
    group: "Python",
    files: [
      "variablespy", "operatorspy", "loopspy", "functionspy", "dictpy", "modulespy",
      "decoratorspy", "generatorspy", "filehandlingpy", "contextmanpy", "exceptionspy",
      "inputoutputpy", "VirtualEnvpy", "LaDpy", "classooppy",
    ],
  },
  {
    group: "C#",
    files: [
      "variablescsharp", "operatorscsharp", "loopscsharp", "functionscsharp",
      "collectionscsharp", "inheritancecsharp", "linqcsharp", "delegatecsharp",
      "asynccsharp", "datatypescsharp", "consolecsharp", "propertiesmethodcsharp",
      "interfacescsharp", "genericscsharp", "dependencycsharp", "designcsharp",
      "errorhandlingcsharp", "CoPcsharp",
    ],
  },
];

export const exampleImagePath = (file: string) => `/examples/${file}.png`;
