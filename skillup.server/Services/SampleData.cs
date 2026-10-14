using skillup.server.Models;

namespace skillup.server.Services
{
    /// <summary>
    /// Starter content used by the admin seed endpoint. Images already live in
    /// skillup.client/public/examples, so the topics only reference them by path.
    /// </summary>
    public static class SampleData
    {
        private static CourseTopic Topic(string title, string content, string image) =>
            new() { Title = title, Content = content, imageUrl = image };

        private static CourseLevel Level(string name, string theory, params CourseTopic[] topics) =>
            new() { Name = name, TheoryText = theory, Topics = topics.ToList(), IsLocked = false };

        private static QuizQuestion Q(string question, string answer, params string[] options) =>
            new() { QuestionText = question, Answer = answer, Options = options.ToList() };

        private static Quiz QuizFor(string slug, string level, params QuizQuestion[] questions) =>
            new() { Slug = slug, Level = level, Questions = questions.ToList() };

        public static List<Course> Courses() => new()
        {
            new Course { Title = "HTML", Slug = "html", Image = "html.png", Category = "Web", LevelCount = 3,
                Description = "Structure web pages with semantic HTML, from the very first tag to accessible, search friendly markup." },
            new Course { Title = "JavaScript", Slug = "javascript", Image = "javascript.png", Category = "Programming", LevelCount = 3,
                Description = "Learn the language of the web: syntax, arrays, higher order functions and asynchronous code." },
            new Course { Title = "Python", Slug = "python", Image = "python.png", Category = "Programming", LevelCount = 3,
                Description = "A friendly introduction to Python, from variables and loops to decorators and generators." },
            new Course { Title = "C#", Slug = "csharp", Image = "csharp.png", Category = "Programming", LevelCount = 3,
                Description = "Object oriented programming with C#: methods, collections, inheritance, LINQ and async." },
        };

        public static List<CourseContent> Contents() => new()
        {
            new CourseContent
            {
                Slug = "html", CourseTitle = "HTML",
                TheoryText = "HTML describes the structure of a web page.",
                Levels = new List<CourseLevel>
                {
                    Level("Beginner", "Start here to understand how a web page is built up.",
                        Topic("What is HTML?", "HTML (HyperText Markup Language) describes the structure of a page using elements. Every document starts with <!DOCTYPE html> followed by the html, head and body elements.", "/examples/basichtml.png"),
                        Topic("Tags and elements", "A tag is written between angle brackets, for example <p>. Most elements have an opening and a closing tag and can be nested inside one another.", "/examples/tagshtml.png"),
                        Topic("Attributes", "Attributes give an element extra information and are placed inside the opening tag, for example class or id.", "/examples/attributeshtml.png")),
                    Level("Advanced", "Make the page interactive and organised.",
                        Topic("Forms", "Forms collect input from the user. Each field is an input element, and the action attribute decides where the data is sent.", "/examples/formshtml.png"),
                        Topic("Tables", "Tables present rows and columns of data. Use table, thead, tbody, tr, th and td to build them.", "/examples/tableshtml.png"),
                        Topic("Links and images", "The a element creates links and the img element embeds images. Always give images an alt text.", "/examples/linkshtml.png")),
                    Level("Expert", "Write markup that machines and people both understand.",
                        Topic("Semantic HTML", "Semantic elements such as header, nav, main, section and footer describe what the content means instead of how it looks.", "/examples/semantichtml.png"),
                        Topic("Accessibility", "Accessible markup works with screen readers: label your form fields, keep a logical heading order and use buttons for actions.", "/examples/accessibilityhtml.png"),
                        Topic("SEO basics", "Search engines read your markup. A unique title, meta description and a clear heading structure improve how the page is indexed.", "/examples/SEOhtml.png")),
                }
            },
            new CourseContent
            {
                Slug = "javascript", CourseTitle = "JavaScript",
                TheoryText = "JavaScript adds behaviour to web pages.",
                Levels = new List<CourseLevel>
                {
                    Level("Beginner", "The building blocks of the language.",
                        Topic("Variables", "Use let for values that change and const for values that stay the same. Avoid var in modern code.", "/examples/variableexamplejs.png"),
                        Topic("Operators", "Operators combine and compare values. Use === and !== to compare without surprising type conversions.", "/examples/operatorsjs.png"),
                        Topic("Conditionals", "if, else if and else run different code depending on a condition. The ternary operator is a short form of if/else.", "/examples/conditionalsjs.png")),
                    Level("Advanced", "Work with collections and reusable logic.",
                        Topic("Functions", "A function groups reusable code. Arrow functions are a compact syntax and do not bind their own this.", "/examples/functionsjs.png"),
                        Topic("Arrays", "Arrays hold ordered lists. map, filter and reduce transform them without mutating the original.", "/examples/arrayjs.png"),
                        Topic("Higher-order functions", "A higher-order function takes a function as an argument or returns one. This is the basis of callbacks and composition.", "/examples/hofjs.png")),
                    Level("Expert", "Handle time and data from the network.",
                        Topic("Async/await", "async marks a function that returns a promise, and await pauses inside it until the promise settles.", "/examples/asyncjs.png"),
                        Topic("Promises", "A promise represents a value that will exist later. Chain with then and handle failures with catch.", "/examples/promisejs.png"),
                        Topic("Fetch API", "fetch performs HTTP requests and returns a promise for the response. Always check response.ok before reading the body.", "/examples/fetchjs.png")),
                }
            },
            new CourseContent
            {
                Slug = "python", CourseTitle = "Python",
                TheoryText = "Python is a readable language used for scripts, data and web services.",
                Levels = new List<CourseLevel>
                {
                    Level("Beginner", "Write your first lines of Python.",
                        Topic("Variables", "Python needs no type declarations: write name = 'Ada' and the type is inferred. Names are case sensitive.", "/examples/variablespy.png"),
                        Topic("Operators", "Arithmetic (+, -, *, /), comparison (==, !=) and logical operators (and, or, not) work as expected.", "/examples/operatorspy.png"),
                        Topic("Loops", "for iterates over a sequence and while repeats while a condition holds. Use range() to count.", "/examples/loopspy.png")),
                    Level("Advanced", "Structure your programs.",
                        Topic("Functions", "Define with def and return a value with return. Default arguments and keyword arguments make calls readable.", "/examples/functionspy.png"),
                        Topic("Dictionaries", "A dict stores key/value pairs and gives fast lookup. Access with square brackets or the safe get() method.", "/examples/dictpy.png"),
                        Topic("Modules", "Split code into modules and import them. Python also ships a large standard library.", "/examples/modulespy.png")),
                    Level("Expert", "Pythonic patterns that keep code short.",
                        Topic("Decorators", "A decorator wraps a function and can add behaviour without changing its body. It is applied with the @ syntax.", "/examples/decoratorspy.png"),
                        Topic("Generators", "A generator yields values lazily with yield, which is memory friendly for large or infinite sequences.", "/examples/generatorspy.png"),
                        Topic("File handling", "Open files with the with statement so they are closed automatically, and remember to set the encoding.", "/examples/filehandlingpy.png")),
                }
            },
            new CourseContent
            {
                Slug = "csharp", CourseTitle = "C#",
                TheoryText = "C# is a statically typed, object oriented language for .NET.",
                Levels = new List<CourseLevel>
                {
                    Level("Beginner", "Types, values and control flow.",
                        Topic("Variables", "Every variable has a type, such as int, double, bool or string. Use var when the type is obvious from the right hand side.", "/examples/variablescsharp.png"),
                        Topic("Operators", "C# supports the usual arithmetic and comparison operators. The null conditional operator ?. avoids null checks.", "/examples/operatorscsharp.png"),
                        Topic("Loops", "for, foreach, while and do-while repeat code. foreach is the clearest choice for collections.", "/examples/loopscsharp.png")),
                    Level("Advanced", "Model your domain with classes.",
                        Topic("Methods", "Methods describe behaviour. Parameters can have default values and the ref/out keywords pass values by reference.", "/examples/functionscsharp.png"),
                        Topic("Collections", "List<T> is an ordered, resizable collection and Dictionary<TKey, TValue> maps keys to values.", "/examples/collectionscsharp.png"),
                        Topic("Inheritance", "A class can inherit from a base class and override its virtual members. Prefer composition when it fits.", "/examples/inheritancecsharp.png")),
                    Level("Expert", "Modern C# for real applications.",
                        Topic("LINQ", "LINQ queries collections with methods such as Where, Select and GroupBy, and can target databases too.", "/examples/linqcsharp.png"),
                        Topic("Delegates and events", "A delegate is a type safe reference to a method. Events use delegates to notify subscribers.", "/examples/delegatecsharp.png"),
                        Topic("Async/await", "async methods return Task and free the thread while waiting for I/O. Use await instead of blocking calls.", "/examples/asynccsharp.png")),
                }
            },
        };

        public static List<Quiz> Quizzes() => new()
        {
            QuizFor("html", "Beginner",
                Q("Which element contains the visible content of a page?", "body", "body", "head", "title", "meta"),
                Q("Which tag creates a paragraph?", "p", "p", "div", "span", "br"),
                Q("What does an attribute do?", "It gives extra information to an element", "It gives extra information to an element", "It closes the document", "It styles the page", "It creates a new file"),
                Q("Which tag creates the largest heading?", "h1", "h1", "h6", "head", "header")),
            QuizFor("html", "Advanced",
                Q("Which element collects user input?", "input", "input", "span", "img", "footer"),
                Q("What is a table row called?", "tr", "tr", "td", "th", "table"),
                Q("Why is the alt attribute important?", "It describes the image for screen readers", "It describes the image for screen readers", "It makes images load faster", "It sets the image size", "It changes the colour"),
                Q("Which element groups form fields with a caption?", "fieldset", "fieldset", "div", "nav", "aside")),
            QuizFor("html", "Expert",
                Q("Which element marks the main navigation?", "nav", "nav", "div", "aside", "section"),
                Q("Which element should appear once and hold the main content?", "main", "main", "section", "article", "div"),
                Q("Which attribute makes an image description useful for screen readers?", "alt", "alt", "src", "title", "longdesc"),
                Q("What improves how a page is indexed by search engines?", "A unique title and meta description", "A unique title and meta description", "A bigger logo", "More div elements", "Inline styles")),
            QuizFor("javascript", "Beginner",
                Q("Which keyword declares a constant?", "const", "const", "let", "var", "static"),
                Q("Which operator compares value and type?", "===", "===", "==", "=", "=>"),
                Q("Which keyword declares a variable that can change?", "let", "let", "const", "final", "static"),
                Q("What does a comparison expression return?", "A boolean", "A boolean", "A string", "A number", "An object")),
            QuizFor("javascript", "Advanced",
                Q("Which method creates a new array by transforming every element?", "map", "map", "forEach", "push", "find"),
                Q("What does a higher-order function do?", "Takes or returns a function", "Takes or returns a function", "Runs faster", "Sorts an array", "Blocks the thread"),
                Q("Which method returns the first matching element?", "find", "find", "filter", "map", "reduce"),
                Q("Which method combines an array into a single value?", "reduce", "reduce", "map", "slice", "join")),
            QuizFor("javascript", "Expert",
                Q("What does await do?", "Pauses the async function until the promise settles", "Pauses the async function until the promise settles", "Blocks the whole browser", "Creates a thread", "Cancels the promise"),
                Q("What does fetch return?", "A promise for the response", "A promise for the response", "A string", "An array", "A DOM node"),
                Q("How do you handle a rejected promise?", "catch", "catch", "then", "finally", "await"),
                Q("What is async/await built on?", "Promises", "Promises", "Callbacks only", "Threads", "Generators only")),
            QuizFor("python", "Beginner",
                Q("Which line creates a string variable?", "text = 'hello'", "text = 'hello'", "string text = hello", "let text = hello", "text := hello"),
                Q("Which loop repeats while a condition is true?", "while", "while", "for", "repeat", "loop"),
                Q("What does len('abc') return?", "3", "3", "2", "abc", "An error"),
                Q("Which is a valid Python comment?", "# comment", "# comment", "// comment", "/* comment */", "<!-- comment -->")),
            QuizFor("python", "Advanced",
                Q("Which structure stores key/value pairs?", "dict", "dict", "list", "tuple", "set"),
                Q("How is a function defined?", "def", "def", "function", "func", "lambda only"),
                Q("How do you import a module?", "import math", "import math", "include math", "using math", "require math"),
                Q("Which method reads a key that may be missing without an error?", "get", "get", "read", "fetch", "index")),
            QuizFor("python", "Expert",
                Q("What is a decorator used for?", "Adding behaviour to a function without changing it", "Adding behaviour to a function without changing it", "Compiling code", "Declaring a class", "Freeing memory"),
                Q("Which keyword produces values lazily?", "yield", "yield", "return", "async", "await"),
                Q("Which statement closes a file automatically?", "with", "with", "try", "open", "close"),
                Q("What does a generator return?", "An iterator", "An iterator", "A list", "A tuple", "A dict")),
            QuizFor("csharp", "Beginner",
                Q("Which keyword lets the compiler infer the type?", "var", "var", "dynamic", "let", "auto"),
                Q("Which loop is clearest for a collection?", "foreach", "foreach", "while", "goto", "do"),
                Q("Which type stores a true/false value?", "bool", "bool", "int", "string", "char"),
                Q("Which symbol ends a statement?", ";", ";", ":", ".", ",")),
            QuizFor("csharp", "Advanced",
                Q("Which collection maps keys to values?", "Dictionary", "Dictionary", "List", "Array", "Queue"),
                Q("Which token inherits from a base class?", ":", ":", "extends", "inherits", "implements"),
                Q("Which keyword marks a method a subclass can override?", "virtual", "virtual", "static", "sealed", "private"),
                Q("Which collection is ordered and resizable?", "List", "List", "Dictionary", "HashSet", "Array")),
            QuizFor("csharp", "Expert",
                Q("Which LINQ method filters a sequence?", "Where", "Where", "Select", "OrderBy", "GroupBy"),
                Q("What does an async method return?", "Task", "Task", "void always", "Promise", "Thread"),
                Q("Which delegate type returns a value?", "Func", "Func", "Action", "EventHandler", "Predicate"),
                Q("Which keyword waits for an asynchronous operation?", "await", "await", "async", "yield", "lock")),
        };
    }
}
