export const fullWordMatchFixtures = [
  {
    name: "handles single word input",
    inputs: ["Studio"],
    compares: [
      {
        compareStrings: [
          "my studio",
          "my_studio",
          "my-studio",
          "my   studio",
          "some studio thumbnail",
          "amy studio",
          "  studio",
          "-studio",
          "studio thumbnail",
          "studio-thumbnail",
          "studio_thumbnail",
        ],
        expected: ["Studio"],
      },
      {
        compareStrings: [
          "MyStudio",
          "myStudio",
          "Mystudio",
          "basicStudio thumbnail",
          "anotherStudio thumbnail",
          "MysTudio",
          "m ystudio",
          "mys tudio",
          "amystudio",
          "  mystudio",
          "-mystudio",
          "mystudio thumbnail",
          "mystudio-thumbnail",
          "mystudio_thumbnail",
        ],
        expected: [],
      },
    ],
  },
  {
    name: "handles two word inputs",
    // If the studio contains known separators, or is PascalCase or camelCase,
    // all of its parts have to match
    inputs: [
      "My Studio",
      "My studio",
      "my Studio",
      "my studio",
      "MyStudio",
      "myStudio",
      "my_studio",
      "my-studio",
    ],
    compares: [
      {
        compareStrings: [
          "my studio",
          "my_studio",
          "my-studio",
          "MyStudio",
          "myStudio",
          "my   studio",
          "again my   studio",
          "my studio thumbnail",
          "MyStudio thumbnail",
          "myStudio thumbnail",
          "myStudio-thumbnail",
          "MyStudio_thumbnail",
          "myStudio -thumbnail",
        ],
        expected: [
          "My Studio",
          "My studio",
          "my Studio",
          "my studio",
          "MyStudio",
          "myStudio",
          "my_studio",
          "my-studio",
        ],
      },
      {
        compareStrings: [
          "Mystudio",
          "MysTudio",
          "m ystudio",
          "mys tudio",
          "amy studio",
          "amystudio",
          "  mystudio",
          "-mystudio",
          "mystudio thumbnail",
          "mystudio-thumbnail",
          "mystudio_thumbnail",
          "my studio-thumbnail", // would be allowed with non strict word matching
          "my studio_thumbnail", // would be allowed with non strict word matching
        ],
        expected: [],
      },
    ],
  },
  {
    name: "lowercase",
    inputs: [
      // lowercase should only match a full word occurrence, since we don't know where to split
      "mystudio",
      "Mystudio",
    ],
    compares: [
      {
        compareStrings: [
          "Mystudio",
          "mystudio",
          "___mystudio",
          "  mystudio",
          "-mystudio",
          "mystudio thumbnail",
          "mystudio-thumbnail",
          "mystudio_thumbnail",
        ],
        expected: ["mystudio", "Mystudio"],
      },
      {
        compareStrings: [
          "MyStudio thumbnail",
          "myStudio thumbnail",
          "MyStudio",
          "MysTudio",
          "my studio",
          "my_studio",
          "my-studio",
          "my   studio",
          "my studio thumbnail",
          "m ystudio",
          "mys tudio",
          "amy studio",
          "amystudio",
        ],
        expected: [],
      },
    ],
  },
  {
    name: "handles word groups in inputs",
    inputs: ["MultiWord studio", "MultiWord Studio", "multiWord studio", "multiWord Studio"],
    compares: [
      {
        compareStrings: [
          "my multi word studio",
          "my multi word Studio",
          "my multiWord studio",
          "my multiWord Studio",
          "my MultiWord studio",
          "my MultiWord Studio",
          "my__multi_word_studio",
          "my-multi-word-studio",
          "MultiWord Studio",
          "multiWord studio",
          "my  multi word   studio",
        ],
        expected: ["MultiWord studio", "MultiWord Studio", "multiWord studio", "multiWord Studio"],
      },
      {
        compareStrings: [
          "multiword studio",
          "multiword studiotwo",
          "multiword studioTwo",
          "multiWord StudioTwo",
          "MultiWord StudioTwo",
          "my multi word studiotwo",
          "my multi word studioTwo",
          "my multi word Studiotwo",
          "my multi word StudioTwo",
          "my MultiWord Studiotwo",
          "my MultiWord StudioTwo",
          "mymultiword studio",
          "MyMultiWord studio",
          "myMultiWord studio",
          "again myMultiWord studio",
          " multi word   my    studio",
          "again multi word  my   studio",
        ],
        expected: [],
      },
    ],
  },
  {
    name: "handles kebab case",
    inputs: ["multi-word-studio"],
    compares: [
      {
        compareStrings: [
          "my multi word studio",
          "my multi word Studio",
          "my__multi_word_studio",
          "my-multi-word-studio",
          "my  multi word   studio",
        ],
        expected: ["multi-word-studio"],
      },
      {
        compareStrings: [
          "multiword studio",
          "multiword studiotwo",
          "multiword studioTwo",
          "multiWord StudioTwo",
          "MultiWord StudioTwo",
          "my multi word studiotwo",
          "my multi word studioTwo",
          "my multi word Studiotwo",
          "my multi word StudioTwo",
          "my MultiWord Studiotwo",
          "my MultiWord StudioTwo",
          "mymultiword studio",
          "MyMultiWord studio",
          "myMultiWord studio",
          "again myMultiWord studio",
          " multi word   my    studio",
          "again multi word  my   studio",
          // would be allowed with non strict word matching
          "my multiWord studio",
          "my multiWord Studio",
          "my MultiWord studio",
          "my MultiWord Studio",
          "MultiWord Studio",
          "multiWord studio",
        ],
        expected: [],
      },
    ],
  },
  {
    name: "flattenWordGroups",
    options: {
      flattenWordGroups: true,
    },
    inputs: ["multi-word-studio"],
    compares: [
      {
        compareStrings: [
          "my multi word studio",
          "my multi word Studio",
          "my__multi_word_studio",
          "my-multi-word-studio",
          "my  multi word   studio",
          "my multiWord studio",
          "my multiWord Studio",
          "my MultiWord studio",
          "my MultiWord Studio",
          "MultiWord Studio",
          "multiWord studio",
          // allowed because of non strict word matching
          "multiWord StudioTwo",
          "MultiWord StudioTwo",
          "my multi word studioTwo",
          "my multi word StudioTwo",
          "my MultiWord StudioTwo",
          "MyMultiWord studio",
          "myMultiWord studio",
          "again myMultiWord studio",
        ],
        expected: ["multi-word-studio"],
      },
      {
        compareStrings: [
          // lowercase words still cannot be split
          "multiword studio",
          "multiword studiotwo",
          "multiword studioTwo",
          "my multi word studiotwo",
          "my multi word Studiotwo",
          "my MultiWord Studiotwo",
          "mymultiword studio",
          " multi word   my    studio",
          "again multi word  my   studio",
        ],
        expected: [],
      },
    ],
  },
  {
    name: "!flattenWordGroups with overlapping inputs",
    options: {
      flattenWordGroups: false,
    },
    inputs: ["My Studio", "My StudioTwo"],
    compares: [
      {
        compareStrings: ["my studioTwo"],
        expected: ["My StudioTwo"],
      },
    ],
  },
  {
    name: "flattenWordGroups, with overlapping inputs, want longest",
    options: {
      flattenWordGroups: true,
      wordGroupConflictMatchMethod: "longest",
    },
    inputs: ["My Studio", "My StudioTwo"],
    compares: [
      {
        compareStrings: ["my studioTwo"],
        expected: ["My StudioTwo"],
      },
    ],
  },
  {
    name: "flattenWordGroups, with overlapping inputs, want shortest",
    options: {
      flattenWordGroups: true,
      wordGroupConflictMatchMethod: "shortest",
    },
    inputs: ["My Studio", "My StudioTwo"],
    compares: [
      {
        compareStrings: ["my studioTwo"],
        expected: ["My Studio"],
      },
    ],
  },
  {
    name: "flattenWordGroups, with only small input",
    options: {
      flattenWordGroups: true,
    },
    inputs: ["My Studio"],
    compares: [
      {
        compareStrings: ["my studioTwo"],
        expected: ["My Studio"],
      },
    ],
  },
  {
    name: "!flattenWordGroups, with only small input",
    options: {
      flattenWordGroups: false,
    },
    inputs: ["My Studio"],
    compares: [
      {
        compareStrings: ["my studioTwo"],
        expected: [],
      },
    ],
  },
  {
    name: "flattenWordGroups, with only long input",
    options: {
      flattenWordGroups: false,
    },
    inputs: ["My StudioTwo"],
    compares: [
      {
        compareStrings: ["my studioTwo"],
        expected: ["My StudioTwo"],
      },
    ],
  },
  {
    name: "!flattenWordGroups, with only long input",
    options: {
      flattenWordGroups: false,
    },
    inputs: ["My StudioTwo"],
    compares: [
      {
        compareStrings: ["my studioTwo"],
        expected: ["My StudioTwo"],
      },
    ],
  },
];
