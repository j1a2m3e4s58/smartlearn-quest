export interface GameNarration {
  title: string;
  objective: string;
  rules: string;
  controls: string;
  tip: string;
  hints: string[];
}

export const GAME_NARRATIONS: Record<string, GameNarration> = {
  // ICT GAMES
  "cursor-precision": {
    title: "Cursor Precision Mission",
    objective:
      "Move your cursor accurately to hit every target zone on screen before time runs out.",
    rules:
      "Click each glowing target within 2 seconds. Missing a target costs you one life.",
    controls:
      "Use your mouse or trackpad to move the cursor and click the targets.",
    tip: "Stay relaxed and aim for the center of each target for maximum accuracy.",
    hints: [
      "Slow down your wrist movement as the cursor approaches the target — precision beats speed.",
      "Fix your eyes on the target, not the cursor. Your hand follows your gaze naturally.",
      "Rest your elbow on the desk to stabilize your arm and reduce cursor jitter.",
    ],
  },
  "keyboard-ninja": {
    title: "Keyboard Ninja",
    objective:
      "Strike the correct keys as they flash on screen to defeat wave after wave of character enemies.",
    rules:
      "Press the highlighted key before it disappears. Correct keystrokes build your combo multiplier.",
    controls: "Use your physical keyboard. Speed and accuracy both matter.",
    tip: "Keep your fingers on the home row keys F and J to reach all letters faster.",
    hints: [
      "The home row is ASDF for the left hand and JKL; for the right. Always return here between strokes.",
      "Look at the screen, not your fingers. Touch-typing builds muscle memory faster.",
      "Practice the top row keys Q W E R T Y separately — they are the hardest to reach accurately.",
    ],
  },
  "file-explorer": {
    title: "File and Folder Explorer",
    objective:
      "Organize scattered files into the correct folder structure to restore order to the desktop.",
    rules:
      "Drag each file into its matching category folder. Misplaced files reduce your score.",
    controls: "Click and drag files. Double-click folders to open them.",
    tip: "Read the file extension carefully. .docx files belong in Documents, .jpg files in Pictures.",
    hints: [
      ".mp3 and .wav files are audio files — they belong in the Music folder.",
      "File extensions tell you the program that opens them: .pdf for documents, .xlsx for spreadsheets.",
      "Use the Details view in a real file explorer to sort files by type, making organization much faster.",
    ],
  },
  "internet-browser": {
    title: "Internet Browser Quest",
    objective:
      "Navigate through web pages to find the correct information and complete your mission objectives.",
    rules:
      "Use the simulated browser to visit sites, follow links, and answer questions about what you find.",
    controls:
      "Click links, type in the address bar, and use Back and Forward buttons to navigate.",
    tip: "Check the URL bar carefully. Malicious sites often have slightly misspelled addresses.",
    hints: [
      "A padlock icon in the address bar means the site uses HTTPS encryption — it is safer to use.",
      "Use Ctrl+F to search for specific words on any webpage instead of reading the whole page.",
      "Bookmarks save time. When you find a useful site, bookmark it immediately for future reference.",
    ],
  },
  "typing-speed": {
    title: "Typing Speed Tournament",
    objective:
      "Type the displayed text as fast and accurately as possible to beat the clock and earn top scores.",
    rules:
      "Type every word exactly as shown. Errors are highlighted in red and must be corrected before moving on.",
    controls:
      "Use your keyboard to type. The cursor advances automatically with each correct character.",
    tip: "Rhythm beats speed. Focus on steady accurate typing rather than bursting fast and making mistakes.",
    hints: [
      "Words per minute is calculated as characters typed divided by 5, then divided by minutes elapsed.",
      "Accuracy is more important than speed. One mistake can drop your effective WPM significantly.",
      "Short common words like 'the', 'and', 'for' appear most often — drill these until they are automatic.",
    ],
  },
  "office-suite": {
    title: "Microsoft Office Challenge",
    objective:
      "Complete real office tasks including formatting documents, building spreadsheets, and creating presentations.",
    rules:
      "Follow the task instructions precisely. Each completed task earns points based on accuracy and speed.",
    controls:
      "Use the simulated Office toolbar, menus, and keyboard shortcuts shown in each task.",
    tip: "Learn the keyboard shortcuts. Ctrl+B for bold, Ctrl+S to save, and Ctrl+Z to undo.",
    hints: [
      "In Excel, always start a formula with an equals sign. =SUM(A1:A10) adds everything from A1 to A10.",
      "In Word, use Styles to keep headings consistent throughout a document — do not format them manually.",
      "In PowerPoint, the 6x6 rule suggests no more than 6 bullet points per slide, 6 words per bullet.",
    ],
  },
  "coding-basics": {
    title: "Coding Basics Arena",
    objective:
      "Write simple code commands to control the on-screen robot and complete each programming mission.",
    rules:
      "Drag or type code blocks in the correct order. Test your code and fix any bugs before submitting.",
    controls:
      "Use the drag-and-drop code editor or type commands directly. Press Run to execute your code.",
    tip: "Read the error messages carefully. They tell you exactly which line needs to be fixed.",
    hints: [
      "Computers execute code top to bottom, one line at a time. Order matters enormously.",
      "A loop repeats a block of code. Use it whenever you need the robot to do the same thing multiple times.",
      "Variables store values. Give them descriptive names like 'speed' or 'distance' so your code is readable.",
    ],
  },
  "cyber-safety": {
    title: "Cyber Safety Defense",
    objective:
      "Identify and block phishing attempts, suspicious links, and digital threats before they breach your system.",
    rules:
      "Examine each incoming message or website and decide if it is safe or dangerous. Wrong decisions cost lives.",
    controls:
      "Click the Safe or Danger button to classify each threat. Use the evidence panel for clues.",
    tip: "Legitimate organizations never ask for your password by email. That is always a red flag.",
    hints: [
      "Hover over links before clicking. The real URL shown at the bottom of the browser reveals the true destination.",
      "Urgent language like 'Act now or your account will be deleted' is a classic phishing pressure tactic.",
      "Check the sender's email address carefully. Support@paypa1.com is not the same as support@paypal.com.",
    ],
  },
  networking: {
    title: "Network Cable Routing",
    objective:
      "Connect all devices in the network by routing cables through the correct paths without loops.",
    rules:
      "Drag cable segments to connect each device to the main router. Every device must have a valid connection.",
    controls:
      "Click and drag cable endpoints. Right-click to remove a cable segment.",
    tip: "Start from the router and work outward, connecting the nearest devices first.",
    hints: [
      "A network loop can cause broadcast storms. Always plan a tree structure with the router at the root.",
      "Switches connect multiple devices within a local network. Routers connect different networks together.",
      "Color-code your cables in real life — different colors for different device types prevents confusion.",
    ],
  },
  "digital-creativity": {
    title: "Digital Creativity Studio",
    objective:
      "Use digital design tools to create original artwork and complete the creative challenges.",
    rules:
      "Each challenge gives you a brief and tools. Create your design and submit it for scoring.",
    controls:
      "Use the toolbox on the left. Click to select, drag to draw, and use the color palette to choose colors.",
    tip: "Composition matters. Balance your design by distributing elements evenly across the canvas.",
    hints: [
      "The rule of thirds: divide the canvas into a 3x3 grid and place your main subject at the intersections.",
      "Contrast makes designs readable. Dark text on a light background or light text on dark always works well.",
      "Limit your color palette to three or four colors for a professional, cohesive look.",
    ],
  },
  "os-basics": {
    title: "Operating System Basics",
    objective:
      "Troubleshoot and fix operating system problems on the virtual computer before the timer runs out.",
    rules:
      "Read each error message and apply the correct fix from the settings panel. Each solved problem earns points.",
    controls:
      "Click on system icons, open menus, and follow the step-by-step repair guides.",
    tip: "Most OS problems are solved in Settings or Task Manager. Check those first.",
    hints: [
      "Task Manager shows you which program is using the most CPU and memory — close the highest one first.",
      "Restarting clears temporary files and refreshes system memory. It solves around 80 percent of common issues.",
      "Disk Cleanup removes temporary files. Run it monthly to keep your computer running smoothly.",
    ],
  },
  "computer-engineering": {
    title: "Virtual PC Assembly Lab",
    objective:
      "Assemble a complete computer by placing each hardware component into the correct slot on the motherboard.",
    rules:
      "Drag components to their matching slots. Incorrect placements are highlighted and must be corrected.",
    controls:
      "Drag and drop each component. Hover over a slot to see its label before placing.",
    tip: "The CPU goes into the large square socket. Align the notch before pressing down.",
    hints: [
      "RAM sticks must be installed in matching pairs in the correct color-coded slots for dual-channel performance.",
      "The GPU plugs into the PCIe x16 slot — the longest expansion slot on the motherboard.",
      "Always connect the 24-pin ATX power connector and the CPU power connector before powering on.",
    ],
  },

  // MATHEMATICS GAMES
  "arithmetic-arena": {
    title: "Arithmetic Arena",
    objective:
      "Defeat arithmetic enemies by solving math problems faster than the enemy can attack you.",
    rules:
      "Solve each equation before the timer hits zero. Correct answers damage the enemy. Wrong answers cost health.",
    controls: "Type the answer using your keyboard and press Enter to submit.",
    tip: "Start with the operation first. Addition then multiplication keeps your mental order clear.",
    hints: [
      "Try estimating before calculating for speed. Rounding to the nearest 10 gives a quick ballpark.",
      "When adding large numbers, break them into tens and ones. 47 plus 36 becomes 40 plus 30, then 7 plus 6.",
      "Look for patterns in multiplication tables — they repeat in predictable ways every 10 steps.",
    ],
  },
  "fractions-kingdom": {
    title: "Fractions Kingdom",
    objective:
      "Build your kingdom by solving fraction problems that unlock walls, towers, and gates.",
    rules:
      "Answer each fraction question correctly to place building blocks. Three wrong answers and your kingdom crumbles.",
    controls:
      "Select your answer from the four options shown. Use the fraction bar tool to visualize before answering.",
    tip: "Always find the common denominator first before adding or subtracting fractions.",
    hints: [
      "To compare fractions, convert them to have the same denominator, then compare the numerators.",
      "Multiplying fractions is straightforward: multiply tops together and bottoms together.",
      "A fraction equals a division problem. Three-quarters means 3 divided by 4, which equals 0.75.",
    ],
  },
  "geometry-builder": {
    title: "Geometry Builder",
    objective:
      "Construct geometric shapes that match the given specifications to score points and unlock blueprints.",
    rules:
      "Use the drawing tools to create the requested shape. Precision earns bonus points.",
    controls:
      "Click to place vertices. The system auto-closes the shape when you return to the starting point.",
    tip: "Use the angle indicator in the corner to measure your angles as you draw.",
    hints: [
      "The interior angles of any triangle always add up to 180 degrees, no exceptions.",
      "A regular polygon has all sides equal and all angles equal. Calculate one angle as (n minus 2) times 180 divided by n.",
      "The perimeter is the total distance around the outside. The area is the space inside the shape.",
    ],
  },
  "algebra-adventure": {
    title: "Algebra Adventure",
    objective:
      "Solve algebraic equations to open doors and navigate through the mystery mansion.",
    rules:
      "Solve for the unknown variable in each equation. Correct solutions unlock the next room. Hints cost coins.",
    controls:
      "Type your answer in the variable field and press Submit. Use the scratch pad on the right for working.",
    tip: "Always perform the same operation on both sides of the equation to keep it balanced.",
    hints: [
      "Think of an equation as a balance scale. Whatever you do to one side must be done to the other.",
      "To isolate the variable, work backwards through the order of operations: undo addition and subtraction first.",
      "Check your answer by substituting it back into the original equation. Both sides should be equal.",
    ],
  },
  "statistics-challenge": {
    title: "Statistics Challenge",
    objective:
      "Analyze datasets to find the mean, median, mode, and range to defeat the data monsters.",
    rules:
      "Each monster presents a dataset. Calculate the requested statistic and enter it correctly to deal damage.",
    controls:
      "Use the number pad to enter your calculated answer. The dataset is displayed on the left panel.",
    tip: "For the median, always sort the numbers in order first before finding the middle value.",
    hints: [
      "The mean is the sum of all values divided by the count. Every value affects it, including outliers.",
      "The mode is the most frequently occurring value. A dataset can have more than one mode.",
      "The range tells you the spread of data. Calculate it as the highest value minus the lowest value.",
    ],
  },
  "money-math": {
    title: "Money Math Market",
    objective:
      "Run your market stall by calculating prices, giving correct change, and managing your balance.",
    rules:
      "Customers will ask for items. Calculate the total cost and give the correct change. Mistakes reduce your revenue.",
    controls:
      "Click coins and notes to make up the change amount. Press Confirm when ready.",
    tip: "Count up from the price to the amount paid. This counting-on method prevents errors.",
    hints: [
      "To calculate change, subtract the item price from the amount the customer paid.",
      "Always give change using the fewest coins possible. Start with the largest coin that fits.",
      "A 10 percent discount means dividing the price by 10. A 20 percent discount doubles that amount.",
    ],
  },
  "measurement-lab": {
    title: "Measurement Laboratory",
    objective:
      "Measure objects accurately using virtual rulers, scales, and measuring cups to complete lab experiments.",
    rules:
      "Read each instrument carefully and enter the correct measurement. Wrong readings fail the experiment.",
    controls:
      "Drag the ruler to position it. Click the measurement line on the scale to record your reading.",
    tip: "Always read from directly above the measurement line to avoid parallax error.",
    hints: [
      "Place the ruler's zero mark exactly at the start of the object, not at the end of the ruler.",
      "Estimate between the smallest marks. A ruler with millimeter markings can be read to 0.5mm accuracy.",
      "Volume and capacity both measure liquids, but volume is in cubic centimeters and capacity is in milliliters.",
    ],
  },
  "time-speed": {
    title: "Time and Speed Hub",
    objective:
      "Calculate arrival times, travel distances, and speeds to guide vehicles safely to their destinations.",
    rules:
      "Apply the distance-speed-time formula to solve each scenario. Every correct answer advances your vehicle.",
    controls:
      "Type your calculated answer in the input field. Use the formula triangle displayed at the top for reference.",
    tip: "Speed equals distance divided by time. Write down what you know before solving for the unknown.",
    hints: [
      "The DST triangle: cover the quantity you want to find. Distance is Speed times Time.",
      "Convert units before calculating. If speed is in km/h and time is in minutes, convert minutes to hours first.",
      "Average speed for a round trip is total distance divided by total time, not the average of the two speeds.",
    ],
  },
  "graphing-systems": {
    title: "Graphing Systems",
    objective:
      "Plot data points and draw lines of best fit to reveal hidden patterns in the mystery datasets.",
    rules:
      "Plot each coordinate pair accurately. Your line of best fit is scored by how close it is to the ideal.",
    controls:
      "Click the graph grid to place points. Drag the ruler tool to draw your trend line.",
    tip: "A good line of best fit has roughly equal numbers of points above and below it.",
    hints: [
      "Coordinates are written as (x, y). The x value tells you how far right, the y value tells you how far up.",
      "The gradient of a line is rise over run — the vertical change divided by the horizontal change.",
      "A positive gradient goes up left to right. A negative gradient goes down left to right.",
    ],
  },
  "math-reasoning": {
    title: "Mathematical Reasoning",
    objective:
      "Solve multi-step word problems using logical mathematical thinking to rescue the stranded explorers.",
    rules:
      "Read each problem carefully and select the correct operation sequence. Each correct chain earns bonus multipliers.",
    controls:
      "Select operations in order using the operation buttons. Enter your final answer in the result field.",
    tip: "Underline the key numbers and the question being asked before you start calculating.",
    hints: [
      "Identify what the question is actually asking — not all numbers in a word problem are needed.",
      "Draw a diagram or table to represent the problem visually before attempting the calculation.",
      "Work backwards from the desired outcome when the problem gives the end result and asks for the starting value.",
    ],
  },
  "mental-math": {
    title: "Mental Math Arena",
    objective:
      "Complete rapid-fire mental calculations without using a calculator to win each speed round.",
    rules:
      "Answer each question within 3 seconds for full points. Slower answers earn fewer points.",
    controls:
      "Tap the correct answer from the four options displayed. Speed is rewarded with bonus points.",
    tip: "For multiplication by 9, multiply by 10 first then subtract the original number.",
    hints: [
      "To multiply any number by 5, multiply by 10 then halve the result.",
      "Doubling and halving: to multiply 24 by 5, halve 24 to get 12, then multiply by 10 to get 120.",
      "For quick addition of long sequences, look for pairs that add to 10 or 100 first.",
    ],
  },
  "magic-math": {
    title: "Magic Mathematics",
    objective:
      "Master Vedic math shortcuts, abacus techniques, and rapid calculation strategies to solve problems at lightning speed.",
    rules:
      "Use the taught shortcut methods to solve each problem. Demonstrate the shortcut technique step-by-step for full marks.",
    controls:
      "Select the shortcut method, then enter each step of the calculation in sequence.",
    tip: "The butterfly method for fractions and the FOIL method for algebra are the fastest routes to the answer.",
    hints: [
      "Vedic squaring: to square any number ending in 5, multiply the tens digit by itself plus 1, then append 25.",
      "The 11 trick: to multiply by 11, split the number and insert the sum of its digits in the middle.",
      "Casting out nines is a fast way to check multiplication answers — it catches most arithmetic errors instantly.",
    ],
  },

  // SCIENCE GAMES
  "human-body": {
    title: "Human Body Explorer",
    objective:
      "Journey through the human body, identifying organs and their functions to heal the sick patient.",
    rules:
      "Drag the correct organ to its position in the body diagram. Identify functions from the options to complete each stage.",
    controls:
      "Click and drag organs from the organ bank. Click an organ in place to see its function options.",
    tip: "The heart pumps blood, the lungs exchange oxygen, and the liver filters toxins.",
    hints: [
      "The small intestine is where most nutrient absorption takes place, not the stomach.",
      "The kidneys filter about 200 litres of blood every single day to produce urine.",
      "The brain contains about 86 billion neurons, each connecting to thousands of others.",
    ],
  },
  "plants-animals": {
    title: "Plants and Animals Safari",
    objective:
      "Classify plants and animals into their correct groups and ecosystem roles to restore the broken food web.",
    rules:
      "Drag each organism to its correct habitat and food web position. Incorrect placements break the chain.",
    controls:
      "Drag organisms from the panel on the right to the food web diagram on the left.",
    tip: "Producers make their own food, primary consumers eat plants, and secondary consumers eat other animals.",
    hints: [
      "Decomposers like fungi and bacteria break down dead matter and return nutrients to the soil.",
      "Photosynthesis converts sunlight, carbon dioxide, and water into glucose and oxygen.",
      "Animals are classified by whether they have a backbone: vertebrates have one, invertebrates do not.",
    ],
  },
  "space-science": {
    title: "Space Science Expedition",
    objective:
      "Navigate your spacecraft through the solar system, answering astronomy questions to chart a safe course.",
    rules:
      "Answer each planet or star question correctly to unlock the next waypoint in your space journey.",
    controls:
      "Click the answer option. Use the star chart in the corner for reference during navigation.",
    tip: "Remember the planets in order with: My Very Energetic Mother Just Served Us Nachos.",
    hints: [
      "Jupiter is the largest planet, so massive it could contain all other planets combined.",
      "A light year is a unit of distance, not time. It is how far light travels in one year: about 9.5 trillion km.",
      "The Sun is a medium-sized star classified as a yellow dwarf. It makes up 99.8 percent of the solar system mass.",
    ],
  },
  "chemistry-lab": {
    title: "Chemistry Laboratory",
    objective:
      "Mix the correct chemical combinations to create reactions that solve each laboratory experiment challenge.",
    rules:
      "Drag chemicals into the reaction vessel in the correct quantities. Wrong combinations cause failed reactions.",
    controls:
      "Drag chemical bottles to the reaction vessel. Adjust quantities using the slider before mixing.",
    tip: "Always balance the number of atoms on both sides of a chemical equation before reacting.",
    hints: [
      "An acid has a pH below 7. A base has a pH above 7. Pure water is neutral at pH 7.",
      "Exothermic reactions release heat energy. Endothermic reactions absorb heat from the surroundings.",
      "The periodic table arranges elements by atomic number. Elements in the same column share properties.",
    ],
  },
  electricity: {
    title: "Electricity Circuit Lab",
    objective:
      "Build complete electrical circuits that power the devices and solve the engineering challenges.",
    rules:
      "Connect components to form a complete circuit. The circuit must have no breaks and correct voltage for each device.",
    controls:
      "Drag wires and components onto the circuit board. Click a component to see its properties.",
    tip: "Electricity flows from positive to negative. Always trace your circuit in that direction to find breaks.",
    hints: [
      "In a series circuit, the same current flows through every component. One break stops everything.",
      "In a parallel circuit, each branch gets the full voltage. Removing one branch does not stop the others.",
      "Ohm's law: voltage equals current multiplied by resistance. If resistance increases, current decreases.",
    ],
  },
  "matter-materials": {
    title: "Matter and Materials Lab",
    objective:
      "Sort and categorize materials by their physical and chemical properties to complete the science experiment.",
    rules:
      "Drag each material to the correct properties column. Test materials using the virtual lab tools before sorting.",
    controls:
      "Click a material to run a test. Drag tested materials to the matching column based on results.",
    tip: "Physical properties include color and hardness. Chemical properties describe how a material reacts.",
    hints: [
      "Density determines if something floats. An object less dense than water will always float in water.",
      "Metals are typically shiny, hard, and conduct electricity well. Non-metals are generally the opposite.",
      "A change in state such as solid to liquid is a physical change. Burning is a chemical change.",
    ],
  },
  "weather-climate": {
    title: "Weather and Climate Lab",
    objective:
      "Predict weather patterns and climate events by analyzing the atmospheric data presented on your screen.",
    rules:
      "Read the weather instruments and choose the correct forecast. Accurate predictions score points.",
    controls:
      "Click the instrument panels to read data. Select your forecast from the options at the bottom.",
    tip: "Rising pressure usually means improving weather. Falling pressure often signals storms ahead.",
    hints: [
      "A barometer measures air pressure. High pressure systems generally bring calm, sunny weather.",
      "The water cycle: evaporation from oceans, condensation to form clouds, precipitation as rain or snow.",
      "Climate is the average weather over 30 years. Weather is what is happening in the atmosphere right now.",
    ],
  },
  "physics-motion": {
    title: "Physics Motion Lab",
    objective:
      "Apply the laws of motion to predict and control the movement of objects in each experiment.",
    rules:
      "Set the correct force and direction values for each object. Your prediction is tested against the real simulation.",
    controls:
      "Adjust force magnitude with the slider and direction with the angle wheel. Press Launch to test.",
    tip: "Force equals mass times acceleration. When mass doubles, you need double the force for the same speed.",
    hints: [
      "Newton's first law: an object at rest stays at rest unless acted upon by an unbalanced force.",
      "Friction opposes motion. On a rough surface, the net force is the applied force minus friction.",
      "On a velocity-time graph, the gradient is acceleration. A flat line means constant speed.",
    ],
  },
  environment: {
    title: "Environmental Science Mission",
    objective:
      "Restore the damaged ecosystem by making correct environmental management decisions across the habitat zones.",
    rules:
      "Each decision affects multiple species and systems. Aim for balance, as too much intervention causes different damage.",
    controls:
      "Click a zone to see its status, then choose from the action options. Confirm your decision to apply it.",
    tip: "Removing pollution sources is always the most effective first step before introducing new species.",
    hints: [
      "Biodiversity makes ecosystems resilient. More species means more recovery pathways when one is disrupted.",
      "A keystone species has disproportionate impact. Removing a wolf population, for example, transforms the whole landscape.",
      "Eutrophication happens when excess nutrients cause algal blooms that deplete oxygen and kill aquatic life.",
    ],
  },
  "earth-science": {
    title: "Earth Science Expedition",
    objective:
      "Analyze rock layers, identify geological formations, and map tectonic plate movements to earn expert status.",
    rules:
      "Examine each rock sample and geological diagram. Match formations to their correct geological period and type.",
    controls:
      "Click samples to examine them under the virtual microscope. Select the correct classification from the menu.",
    tip: "Sedimentary rocks form in layers. Deeper layers are older than the layers above them.",
    hints: [
      "Igneous rock forms from cooled magma. Granite cooled slowly underground; basalt cooled quickly at the surface.",
      "Metamorphic rock is formed when heat and pressure transform existing rock without melting it completely.",
      "Tectonic plates move at roughly the speed your fingernails grow — a few centimeters per year.",
    ],
  },
  "renewable-energy": {
    title: "Renewable Energy Systems",
    objective:
      "Design and optimize renewable energy systems to power the off-grid village before resources run out.",
    rules:
      "Place solar panels, wind turbines, and hydro generators to meet the power demand of each building.",
    controls:
      "Drag energy components from the toolbar. Click placed components to adjust their angle and output.",
    tip: "Solar panels work best at 30 degrees facing south, and wind turbines need open space free of obstacles.",
    hints: [
      "Energy stored in batteries allows solar and wind systems to supply power after dark or when there is no wind.",
      "Hydroelectric power is the most consistent renewable source because water flow is predictable.",
      "A kilowatt-hour is the energy consumed by a 1000-watt device running for one hour.",
    ],
  },
  "scientific-investigation": {
    title: "Scientific Investigation Lab",
    objective:
      "Design and run controlled experiments, collect data, and draw conclusions to solve the scientific mystery.",
    rules:
      "Follow the scientific method: state a hypothesis, change one variable, collect results, and interpret the data.",
    controls:
      "Use the lab setup panel to configure variables. Run the experiment and record results in the notebook.",
    tip: "Change only one variable at a time. Changing multiple variables makes it impossible to know what caused the result.",
    hints: [
      "A hypothesis must be testable and falsifiable. If no experiment could prove it wrong, it is not a valid hypothesis.",
      "Use a control group that receives no treatment. Without it you cannot know if the variable caused the change.",
      "Bar graphs are best for comparing categories. Line graphs are best for showing change over time.",
    ],
  },

  // ENGLISH GAMES
  "grammar-city": {
    title: "Grammar City",
    objective:
      "Fix the broken grammar in city signs, documents, and newspapers to restore order to Grammar City.",
    rules:
      "Identify the grammatical error in each sentence and select the correct replacement. Three errors cause a power outage.",
    controls:
      "Click the error word to highlight it, then choose the correction from the dropdown options.",
    tip: "Look for subject-verb agreement first. The verb must always match whether the subject is singular or plural.",
    hints: [
      "Collective nouns like 'team' or 'family' are usually singular in formal writing.",
      "Past perfect uses 'had' plus the past participle. 'Had eaten' not 'ate' when describing events before another past event.",
      "Apostrophes show possession or contraction. 'It's' means 'it is'. 'Its' shows belonging.",
    ],
  },
  "vocabulary-quest": {
    title: "Vocabulary Quest",
    objective:
      "Collect new vocabulary words by matching them to their definitions across the enchanted word forest.",
    rules:
      "Match each word card to its correct definition card. Incorrect matches flip back over after a short delay.",
    controls:
      "Click a word card, then click its matching definition. They glow green if correct.",
    tip: "Look for context clues in the definition. Prefixes like un, re, and pre often reveal the meaning.",
    hints: [
      "The prefix 'bio' means life. The prefix 'geo' means earth. Knowing prefixes unlocks hundreds of words.",
      "A word's etymology — its origin — often reveals its meaning. Many English words come from Latin or Greek roots.",
      "Use new vocabulary words in a sentence immediately after learning them. Active use is the fastest way to remember.",
    ],
  },
  "reading-adventure": {
    title: "Reading Adventure",
    objective:
      "Read the story passages carefully and answer comprehension questions to advance on the adventure map.",
    rules:
      "Read each passage in full before answering. Some questions test inference, not just recall.",
    controls:
      "Scroll through the passage, then select your answer below. You can reread at any time.",
    tip: "For inference questions, look for clues in the character actions and words, not just what is stated directly.",
    hints: [
      "Skimming means reading quickly for main ideas. Scanning means searching for a specific word or fact.",
      "Topic sentences usually appear at the start of a paragraph and summarize the main idea of that paragraph.",
      "When the author describes setting in detail, it often foreshadows or reflects the emotional tone of the scene.",
    ],
  },
  "pronunciation-studio": {
    title: "Pronunciation Studio",
    objective:
      "Practise pronouncing words correctly using the microphone feedback system to earn pronunciation stars.",
    rules:
      "Listen to the target pronunciation, then record your own voice. The system scores your accuracy out of 5 stars.",
    controls:
      "Press the Hear button to listen to the model pronunciation. Press Record to speak your attempt.",
    tip: "Break long words into syllables and practise each part separately before saying the full word.",
    hints: [
      "The schwa sound, represented as 'uh', is the most common vowel sound in English. It appears in unstressed syllables.",
      "Silent letters: the 'k' in 'knee', the 'b' in 'lamb', and the 'w' in 'write' are not pronounced.",
      "Stress the correct syllable. 'Re-CORD' is a verb. 'REC-ord' is a noun. Stress changes the meaning.",
    ],
  },
  "story-builder": {
    title: "Story Builder Hub",
    objective:
      "Create compelling stories by arranging plot elements, characters, and settings into a coherent narrative.",
    rules:
      "Arrange the story cards in logical order. Your story is evaluated for structure, logic, and creativity.",
    controls:
      "Drag story cards into the timeline slots. Click a card to edit its text before submitting.",
    tip: "Every story needs a beginning with the setting, a middle with the problem, and an end with the resolution.",
    hints: [
      "The five-act structure: exposition, rising action, climax, falling action, resolution. Each part serves a purpose.",
      "A protagonist wants something. Every story conflict is the obstacle between the protagonist and that goal.",
      "Show character through choices, not descriptions. What a character does under pressure reveals who they are.",
    ],
  },
  "poetry-literature": {
    title: "Poetry and Literature",
    objective:
      "Identify poetic devices, analyze literary techniques, and complete poems to demonstrate literary mastery.",
    rules:
      "Read each poem or excerpt, then answer the analysis questions. Identify devices like metaphor, simile, and alliteration.",
    controls:
      "Click the underlined phrase to tag it with the correct literary device from the options shown.",
    tip: "Similes use like or as to compare. Metaphors say one thing is another directly.",
    hints: [
      "Alliteration is the repetition of the same consonant sound at the start of consecutive words.",
      "Personification gives human qualities to non-human things. 'The wind whispered' is personification.",
      "Stanzas in poetry work like paragraphs in prose — they group related ideas together.",
    ],
  },
  "spelling-kingdom": {
    title: "Spelling Kingdom",
    objective:
      "Build your kingdom by spelling words correctly in each royal spelling challenge and tournament.",
    rules:
      "Listen to the word, then type its correct spelling. Each correct word adds a building to your kingdom.",
    controls:
      "Use your keyboard to type the word after hearing it. Press the speaker icon to replay the audio.",
    tip: "Remember the rule: I before E except after C, except in words like neighbor and weigh.",
    hints: [
      "Double consonants appear after short vowels. 'Running' doubles the n because the vowel 'u' is short.",
      "Words ending in a silent 'e' usually drop the 'e' before adding a suffix that starts with a vowel.",
      "Mnemonics help with tricky spellings. For 'because' — Big Elephants Can Always Understand Small Elephants.",
    ],
  },
  "listening-challenge": {
    title: "Listening Challenge",
    objective:
      "Listen carefully to audio passages and answer comprehension questions to prove your listening skills.",
    rules:
      "Each audio clip plays once. Pay close attention to details, tone, and key information as you listen.",
    controls:
      "Press Play to hear the audio. Answer the questions below using the options provided.",
    tip: "Take brief mental notes on who is speaking, what they are discussing, and what their main point is.",
    hints: [
      "Signal words like 'however', 'therefore', and 'in contrast' indicate a shift or conclusion in the speaker's argument.",
      "Tone of voice reveals attitude. A rising intonation at the end of a statement can indicate uncertainty.",
      "Listen for repetition — speakers emphasize important points by restating them in different words.",
    ],
  },
  "public-speaking": {
    title: "Public Speaking Studio",
    objective:
      "Deliver speeches on assigned topics with confidence, clarity, and correct structure to win the debate rounds.",
    rules:
      "Select your speech structure, practice with the teleprompter, then record your delivery for scoring.",
    controls:
      "Click Record to begin your speech. The teleprompter shows your script at your chosen scroll speed.",
    tip: "A strong opening grabs attention. Start with a surprising fact, a question, or a short story.",
    hints: [
      "Vary your pace deliberately. Slow down for important points, speed up slightly for background information.",
      "Pause after key statements. A 2-second pause lets the audience absorb what you just said.",
      "Eye contact builds trust. Look at different sections of your audience rather than staring at your notes.",
    ],
  },
  "debate-arena": {
    title: "Debate Arena",
    objective:
      "Win debate rounds by selecting the strongest arguments and responding effectively to opposing points.",
    rules:
      "Choose your argument cards carefully. Each argument is scored for relevance, strength, and delivery quality.",
    controls:
      "Click an argument card to select it. Use the Rebut button when the opponent makes a weak point.",
    tip: "Address the opponent strongest point directly rather than ignoring it. This builds your credibility.",
    hints: [
      "A strong argument has three parts: the claim, the evidence, and the reasoning connecting them.",
      "The Socratic method: ask questions that expose the flaws in the opponent's position without stating them directly.",
      "Conceding a minor point strategically makes you appear fair and makes your stronger points more persuasive.",
    ],
  },
  "communication-skills": {
    title: "Communication Skills",
    objective:
      "Navigate real-world communication scenarios by choosing the most effective and appropriate responses.",
    rules:
      "Read each scenario and select the response that best achieves the communication goal. Context matters greatly.",
    controls:
      "Read the scenario, then click your chosen response option. Your score reflects appropriateness and effectiveness.",
    tip: "Formal situations require different vocabulary than casual ones. Always consider who you are speaking to.",
    hints: [
      "Active listening means responding to what was said, not preparing your next point while the other person speaks.",
      "Non-verbal communication — posture, eye contact, facial expression — carries more meaning than the words alone.",
      "In conflict situations, use 'I feel' statements instead of 'you always' or 'you never' to reduce defensiveness.",
    ],
  },
  "creative-writing": {
    title: "Creative Writing Lab",
    objective:
      "Complete creative writing challenges including short stories, descriptions, and character profiles.",
    rules:
      "Write within the word limit shown. Your writing is scored for vocabulary range, structure, and creativity.",
    controls:
      "Type in the writing area. Use the word count tracker and the suggestion panel for inspiration.",
    tip: "Show rather than tell. Instead of writing that the character was scared, describe their shaking hands and rapid heartbeat.",
    hints: [
      "Strong verbs do more work than adjectives. 'He sprinted' is more vivid than 'He ran very fast'.",
      "Vary your sentence length for rhythm. Short sentences create tension. Longer sentences provide context and flow.",
      "Start in the middle of the action. Beginning with a character waking up is the most overused opening in fiction.",
    ],
  },

  // ROBOTICS GAMES
  "robot-building": {
    title: "Robot Building Workshop",
    objective:
      "Assemble functional robots by connecting the correct components to complete each engineering challenge.",
    rules:
      "Drag robot parts to their connection points on the chassis. Test your robot to verify it performs the required task.",
    controls:
      "Drag parts from the component panel. Click connection points to lock parts in place. Press Test to run your robot.",
    tip: "Start with the power supply and motor before adding sensors. A robot cannot sense without power first.",
    hints: [
      "The microcontroller is the brain of the robot. It reads sensor inputs and sends commands to motors.",
      "Actuators convert electrical signals into physical movement. Servo motors control precise angular position.",
      "Always check the current rating of your power supply. Underpowered motors move slowly or not at all.",
    ],
  },
  sensors: {
    title: "Sensors Laboratory",
    objective:
      "Program sensors to detect the correct inputs and trigger the right responses in each automation challenge.",
    rules:
      "Connect sensors to their triggers and configure the threshold values. Your setup is tested against the target scenario.",
    controls:
      "Drag sensor icons to input positions. Set threshold values using the slider, then wire them to outputs.",
    tip: "An ultrasonic sensor measures distance using sound waves. It is perfect for obstacle detection.",
    hints: [
      "Infrared sensors work well in low light but struggle with black surfaces that absorb IR radiation.",
      "Threshold values filter out noise. Set them just above the background level to avoid false triggers.",
      "A PIR sensor detects movement by measuring changes in infrared radiation, not objects directly.",
    ],
  },
  circuits: {
    title: "Circuit Challenge",
    objective:
      "Build complete electrical circuits using resistors, capacitors, and LEDs to meet the design specifications.",
    rules:
      "Connect components on the breadboard to match the circuit diagram. Power up and verify the circuit functions correctly.",
    controls:
      "Drag components from the parts tray to the breadboard. Draw wires by clicking start and end connection points.",
    tip: "Use the formula voltage equals current times resistance to calculate the correct resistor value.",
    hints: [
      "Each row of holes on a breadboard is connected internally. Columns A through E and F through J are the two rails.",
      "LEDs have polarity — the longer leg is positive and must connect towards the higher voltage side.",
      "Capacitors store charge temporarily. They smooth out voltage spikes and filter noise in power supplies.",
    ],
  },
  "coding-robots": {
    title: "Robot Programming Academy",
    objective:
      "Write code to program your robot to complete maze navigation and object sorting challenges.",
    rules:
      "Write or assemble code blocks to define robot behavior. Test your code and debug any logic errors before submitting.",
    controls:
      "Drag code blocks from the palette or type commands. Press Run to test and Debug to step through line by line.",
    tip: "Use loops for repetitive movements. This makes your code shorter and easier to understand.",
    hints: [
      "Modular code is easier to debug. Write one function for turning, one for moving forward — test each separately.",
      "If the robot drifts, add a calibration constant to one motor speed to compensate for physical differences.",
      "State machines are a powerful way to code robot behavior: each state defines what the robot does in one situation.",
    ],
  },
  "ai-automation": {
    title: "AI and Automation Lab",
    objective:
      "Design automated systems that use AI decision trees to perform tasks without human input.",
    rules:
      "Build decision trees by connecting condition nodes to action nodes. Your automation must handle all listed scenarios.",
    controls:
      "Drag decision nodes from the toolbar. Connect them by clicking the output of one to the input of another.",
    tip: "Test your automation with edge cases. Unusual inputs are where automation systems most commonly fail.",
    hints: [
      "A decision tree always has a yes or no branch at each node. Complex behavior emerges from simple conditions.",
      "Machine learning trains a model using labeled examples. The model finds patterns without being explicitly programmed.",
      "Overfitting happens when a model performs well on training data but fails on new data it has not seen before.",
    ],
  },
  "electronics-lab": {
    title: "Electronics Engineering Lab",
    objective:
      "Design and test electronic components including transistors, diodes, and logic gates in circuit simulations.",
    rules:
      "Build circuits that produce the required output signals. Use the oscilloscope tool to verify waveforms.",
    controls:
      "Drag components to the circuit board. Use the probe tool to measure voltage at any point in the circuit.",
    tip: "A transistor acts as an electronic switch. Apply voltage to the base to allow current through the collector.",
    hints: [
      "An AND gate outputs 1 only when both inputs are 1. An OR gate outputs 1 when at least one input is 1.",
      "A diode allows current to flow in only one direction. It is used to protect circuits from reverse voltage.",
      "The oscilloscope shows voltage over time. A flat line means DC. A wave pattern means AC or a digital signal.",
    ],
  },
  "machine-logic": {
    title: "Machine Logic Systems",
    objective:
      "Program logical sequences that control industrial machines to manufacture products correctly.",
    rules:
      "Write the correct logic sequence for each machine operation. Errors in sequence cause manufacturing defects.",
    controls:
      "Use the flowchart builder to sequence operations. Drag condition diamonds and action rectangles.",
    tip: "Always include error-handling branches in your logic. A machine that cannot respond to faults will break.",
    hints: [
      "PLC ladder logic reads left to right. Contacts on the left are conditions, coils on the right are outputs.",
      "Interlocks prevent dangerous states. Program the machine so two conflicting operations can never run at once.",
      "Timers and counters are fundamental PLC instructions. TON starts counting when the input is true.",
    ],
  },
  "drone-systems": {
    title: "Drone Navigation Systems",
    objective:
      "Program and fly drones through obstacle courses to deliver packages and complete aerial missions.",
    rules:
      "Write flight path code or use manual controls to navigate the drone. Avoid obstacles and land precisely on targets.",
    controls:
      "Program mode: use directional commands with distance values. Manual mode: use arrow keys for precise flight.",
    tip: "Drones need a landing zone clearance of at least their rotor diameter on all sides for safe touchdown.",
    hints: [
      "Quadcopter stability comes from balancing thrust on all four motors. A PID controller adjusts each motor in real time.",
      "GPS provides absolute position. In GPS-denied environments, drones use accelerometers and gyroscopes for navigation.",
      "Throttle controls altitude. Pitch and roll control horizontal movement. Yaw rotates the drone around its vertical axis.",
    ],
  },
  "smart-home": {
    title: "Smart Home Systems",
    objective:
      "Program smart home devices to respond to voice commands and sensor triggers using automation rules.",
    rules:
      "Create automation rules that link sensor inputs to device outputs. All listed scenarios must be handled correctly.",
    controls:
      "Use the IF-THEN rule builder. Select the trigger sensor and the device action to complete each rule.",
    tip: "Add time conditions to your rules. A light sensor should only trigger after sunset to save energy.",
    hints: [
      "Smart devices communicate over protocols like Zigbee, Z-Wave, or Wi-Fi. Each has different range and power trade-offs.",
      "A hub centralizes automation. Rules run locally on the hub so they still work when the internet is down.",
      "Geofencing uses your phone's location to trigger automations when you arrive or leave a geographic boundary.",
    ],
  },
  "mechanical-engineering": {
    title: "Mechanical Engineering Lab",
    objective:
      "Design mechanical systems using gears, levers, and pulleys to lift loads and transmit motion efficiently.",
    rules:
      "Connect mechanical components to meet the force output requirement. Efficiency above 80 percent scores bonus points.",
    controls:
      "Drag gears and levers to the workspace. Click components to set their size and gear ratio.",
    tip: "A gear ratio greater than 1 increases force but reduces speed. Choose based on what the task needs most.",
    hints: [
      "A simple lever multiplies force. The mechanical advantage equals the effort arm divided by the load arm.",
      "Gears in mesh always rotate in opposite directions. Add an idler gear between them to make them rotate the same way.",
      "Friction reduces efficiency in every mechanical system. Lubrication and smooth surfaces minimize energy losses.",
    ],
  },
  "industrial-automation": {
    title: "Industrial Automation Factory",
    objective:
      "Program the assembly line to manufacture products at full capacity with zero defects and minimal downtime.",
    rules:
      "Sequence each station in the assembly line correctly. Monitor quality indicators and adjust programs when errors appear.",
    controls:
      "Use the PLC programming panel to set station timing and conditions. Click a station to edit its parameters.",
    tip: "Parallel processing, running stations simultaneously, increases factory throughput significantly.",
    hints: [
      "Cycle time is the time taken to produce one unit. Reducing the bottleneck station reduces total cycle time.",
      "Six Sigma aims for fewer than 3.4 defects per million opportunities. Quality control prevents waste.",
      "Just-in-time manufacturing reduces inventory by delivering materials exactly when the assembly station needs them.",
    ],
  },
  mechatronics: {
    title: "Mechatronics Integration Lab",
    objective:
      "Integrate mechanical, electronic, and software systems to create a fully functional mechatronic device.",
    rules:
      "Complete all three integration layers: mechanical assembly, electrical wiring, and software programming.",
    controls:
      "Switch between the Mechanical, Electrical, and Software tabs. Complete each layer before integration testing.",
    tip: "Interface design is critical. The mechanical movement range must match what the sensor can measure.",
    hints: [
      "Mechatronics combines mechanics, electronics, and control theory. All three must be designed together, not separately.",
      "Feedback control compares the current state with the desired state and adjusts the actuator to reduce the error.",
      "Signal conditioning scales sensor output to the range expected by the microcontroller's analog input pins.",
    ],
  },

  // CRITICAL THINKING GAMES
  "logic-puzzles": {
    title: "Logic Puzzle Vault",
    objective:
      "Solve progressively complex logic puzzles using deductive and inductive reasoning to unlock the vault.",
    rules:
      "Work through each clue systematically. Use the grid to eliminate possibilities until only one solution remains.",
    controls:
      "Click a grid cell to toggle between possible and impossible. Use the clue panel on the right for reference.",
    tip: "Start with the most specific clue, the one that places a single item in a definite position.",
    hints: [
      "Deductive reasoning moves from general rules to specific conclusions. If all A are B and X is A, then X is B.",
      "Process of elimination is often faster than finding the answer directly. Eliminate what is impossible first.",
      "Work from the most constrained variable — the one with fewest possibilities — to solve puzzles fastest.",
    ],
  },
  "memory-training": {
    title: "Memory Training Academy",
    objective:
      "Memorize and recall sequences of symbols, numbers, and patterns with increasing precision.",
    rules:
      "Study the pattern during the display phase, then reproduce it exactly from memory. Longer sequences earn more points.",
    controls:
      "Watch the pattern carefully during display time. Click the grid cells to reproduce the pattern from memory.",
    tip: "Group items into chunks. Remembering 3 groups of 3 is far easier than 9 individual items.",
    hints: [
      "The method of loci: mentally place each item at a specific location along a familiar route to recall in order.",
      "Spaced repetition is the most scientifically proven memory technique. Review material just before you forget it.",
      "Creating a vivid story connecting items makes abstract sequences dramatically easier to remember.",
    ],
  },
  "strategy-games": {
    title: "Strategy Battle Arena",
    objective:
      "Outmaneuver AI opponents using strategic planning, resource management, and tactical decision-making.",
    rules:
      "Plan your moves carefully. Each action uses resources. Defeat the enemy general by controlling key territories.",
    controls:
      "Click units to select them, then click a destination to move. Press the Action button to attack or build.",
    tip: "Control the center of the board early. Central positions give you the most movement options.",
    hints: [
      "Economy matters as much as tactics. An opponent who runs out of resources loses regardless of positional advantage.",
      "Feinting — threatening one area while attacking another — forces the opponent to spread their resources thin.",
      "In positional games, a long-term strategic advantage often outweighs a short-term tactical gain.",
    ],
  },
  "brain-teasers": {
    title: "Brain Teasers Challenge",
    objective:
      "Crack a collection of lateral thinking puzzles, riddles, and brain teasers to prove your mental agility.",
    rules:
      "Each puzzle has one correct solution. Hints are available but cost points. Think creatively before requesting hints.",
    controls:
      "Type your answer in the response field. Click Hint to get a clue if you are stuck.",
    tip: "Brain teasers often use wordplay or unconventional interpretations. Read the question from multiple angles.",
    hints: [
      "Question your initial assumptions. Brain teasers are designed to exploit the first interpretation that comes to mind.",
      "Pay attention to every word in the question. Key constraints are often embedded in how the question is phrased.",
      "Lateral thinking means solving problems through indirect, creative approaches rather than logical step-by-step methods.",
    ],
  },
  "coding-logic": {
    title: "Coding Logic Lab",
    objective:
      "Trace code execution paths, predict outputs, and debug logical errors across programming challenges.",
    rules:
      "Step through code mentally or use the debugger to trace variables. Predict the output before running.",
    controls:
      "Use the Step button to trace code line by line. The variable tracker on the right updates after each step.",
    tip: "Trace through loops by tracking the loop variable value, follow it from start to when the condition fails.",
    hints: [
      "Off-by-one errors are the most common loop bug. Check whether your loop uses less-than or less-than-or-equal at the boundary.",
      "Print debugging: inserting print statements at key points reveals the actual value of variables at runtime.",
      "Rubber duck debugging: explain your code line by line out loud. You will often find the error yourself.",
    ],
  },
  "escape-room": {
    title: "Escape Room Mission",
    objective:
      "Solve interconnected puzzles hidden across the room to find the escape code before time runs out.",
    rules:
      "Examine every object in the room. Clues from one puzzle unlock the next. Use your inventory wisely.",
    controls:
      "Click objects to examine them. Combine items in your inventory by dragging one onto another.",
    tip: "Keep notes on all numbers and symbols you find. They almost always appear in the final combination.",
    hints: [
      "Organize your inventory early. Knowing what you have prevents missing the connection between items.",
      "Puzzles in escape rooms rarely stand alone. A code from one puzzle is almost always used somewhere else.",
      "If stuck, revisit areas you have already searched. New items or clues sometimes unlock when other puzzles are solved.",
    ],
  },
  "pattern-recognition": {
    title: "Pattern Recognition Challenge",
    objective:
      "Identify complex visual and numerical patterns to predict the next element in each sequence.",
    rules:
      "Study the sequence carefully and identify the rule. Enter the next two elements in the pattern to score.",
    controls:
      "Type the next element in the sequence field. Press Tab to move to the second field.",
    tip: "Check differences between consecutive terms first, then check ratios, then look for alternating sub-sequences.",
    hints: [
      "Fibonacci sequences add the two previous terms to get the next. Look for this pattern in nature-themed puzzles.",
      "Some patterns have two interleaved sequences. Check every other term separately when the pattern seems irregular.",
      "Visual patterns often repeat by rotation, reflection, or colour shift. Try all three transformations when stuck.",
    ],
  },
  detective: {
    title: "Detective Investigation",
    objective:
      "Gather evidence, interrogate witnesses, and deduce the culprit in each crime mystery case.",
    rules:
      "Collect all available clues before making an accusation. Accusing the wrong suspect ends the case in failure.",
    controls:
      "Click locations to search for evidence. Click characters to interrogate them. Use the evidence board to connect clues.",
    tip: "Alibis that are inconsistent with physical evidence are your most reliable leads. Always cross-reference.",
    hints: [
      "Motive, means, and opportunity are the three pillars of criminal investigation. All three must align for a conviction.",
      "Witnesses remember the same event differently. Look for the consistent detail that appears in all accounts.",
      "Physical evidence cannot lie. When testimony contradicts physical evidence, trust the evidence.",
    ],
  },
  "strategic-planning": {
    title: "Strategic Planning Simulation",
    objective:
      "Manage limited resources to achieve complex goals under changing conditions and competing priorities.",
    rules:
      "Allocate your budget and time across multiple projects. Random events will change conditions, so adapt your plan.",
    controls:
      "Use the planning board to assign resources. Click an event card to see its impact and respond.",
    tip: "Reserve at least 20 percent of your resources as a contingency. Unexpected events are guaranteed.",
    hints: [
      "Prioritize tasks by impact and urgency. High-impact, urgent tasks come first. Low-impact, non-urgent tasks last.",
      "Critical path analysis identifies the sequence of dependent tasks that determines the minimum project duration.",
      "Stakeholder expectations shape success criteria. A project on time and budget still fails if key stakeholders are unsatisfied.",
    ],
  },
  "innovation-lab": {
    title: "Innovation Laboratory",
    objective:
      "Design and prototype creative solutions to real-world problems using design thinking principles.",
    rules:
      "Follow the design thinking stages: empathize, define, ideate, prototype, and test. Each stage builds on the last.",
    controls:
      "Use the design canvas on the right. Drag idea cards from the bank and connect them to build your prototype.",
    tip: "Generate at least five different ideas before evaluating any of them. The best solution rarely comes first.",
    hints: [
      "The empathy stage involves understanding the user's actual problem, not the problem you assumed they had.",
      "Brainstorming rules: no criticism allowed during ideation. Every idea is recorded. Quantity beats quality at this stage.",
      "A minimum viable prototype tests the riskiest assumption first, not all assumptions at once.",
    ],
  },
  "decision-making": {
    title: "Decision Making Arena",
    objective:
      "Analyze multi-factor scenarios and make the decision that produces the best outcome for all stakeholders.",
    rules:
      "Weigh the costs and benefits of each option carefully. Your decision is evaluated by long-term outcomes.",
    controls:
      "Click an option to see its projected outcomes. Use the comparison matrix to weigh all factors before deciding.",
    tip: "Consider second-order effects, what happens as a result of the direct result of your decision.",
    hints: [
      "A decision matrix assigns numerical weights to criteria and scores each option, making complex decisions objective.",
      "Reversible decisions can be made quickly and corrected later. Irreversible decisions require more analysis upfront.",
      "Sunk cost fallacy: do not factor in resources already spent when deciding whether to continue a failing course of action.",
    ],
  },
  "problem-solving": {
    title: "Problem Solving Arena",
    objective:
      "Break down complex problems into steps and apply systematic problem-solving frameworks to reach solutions.",
    rules:
      "Define the problem clearly before attempting a solution. Use the IDEAL framework displayed to structure your approach.",
    controls:
      "Fill in each stage of the problem-solving framework. Click Next Stage when your current stage is complete.",
    tip: "The most important step is defining the problem correctly. A well-defined problem is already half solved.",
    hints: [
      "IDEAL stands for Identify, Define, Explore, Act, Look back. Each step prevents jumping to solutions prematurely.",
      "Decomposition breaks a complex problem into smaller sub-problems, each of which can be solved independently.",
      "After solving, review the process. Understanding why your approach worked is more valuable than the solution itself.",
    ],
  },
};
