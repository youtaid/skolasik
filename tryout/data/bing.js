// Subtes 5 — Bahasa Inggris
module.exports = {
  id: "ING",
  title: "Bahasa Inggris (English)",
  time: 40,
  relevance: "MAN IC (Literasi Membaca B. Inggris), Labschool (Tes Akademik), SMANU MH Thamrin (Tes Akademik), SMA Al Azhar",
  instructions: [
    "Questions 1–10: reading comprehension. Questions 11–13: functional expressions. Questions 14–21: grammar. Questions 22–25: vocabulary.",
    "Choose the best answer.",
  ],
  items: [
    { stim: { title: "Text 1 — for questions 1–4", paras: [
      "ANNOUNCEMENT",
      "To all Grade 9 students,",
      "The Science Club will hold a Robotics Workshop on Saturday, 16 January, from 08.00 to 12.00 in the Computer Laboratory. Participants will learn how to build and program a simple line-following robot. Seats are limited to 30 students, so please register with Ms. Rahma in the teachers' room no later than Wednesday, 13 January.",
      "Participants must bring their own laptop. The registration fee of Rp50,000 covers the robot kit, which participants may take home after the workshop.",
      "Science Club Committee",
    ] } },
    { t: "Reading – purpose", l: 1, q: "What is the purpose of the text?", o: ["To inform students about a robotics workshop", "To invite teachers to a science competition", "To explain how to program a robot", "To sell robot kits to students"], e: "The announcement tells Grade 9 students about the time, place, and requirements of a robotics workshop." },
    { t: "Reading – detail", l: 1, q: "Which statement is TRUE according to the text?", o: ["Participants can keep the robot kit", "The workshop is held on Wednesday", "Laptops will be provided by the school", "Registration is done in the Computer Laboratory"], e: "‘…the robot kit, which participants may take home after the workshop.’" },
    { t: "Reading – inference", l: 3, q: "From the sentence “Seats are limited to 30 students”, we can infer that …", o: ["students should register early because places may run out", "only 30 students in Grade 9 like robotics", "the workshop will be cancelled if fewer than 30 students join", "every student must join the workshop"], e: "Limited seats imply that late registrants may not get a place." },
    { t: "Reading – vocabulary in context", l: 2, q: "The word “covers” in the text is closest in meaning to …", o: ["pays for", "hides", "protects", "describes"], e: "‘The fee covers the robot kit’ = the fee pays for the kit." },

    { stim: { title: "Text 2 — for questions 5–10", paras: [
      "The Komodo Dragon",
      "(1) The Komodo dragon (Varanus komodoensis) is the largest living lizard in the world. It is found only on a few islands in eastern Indonesia, including Komodo, Rinca, and parts of Flores. An adult male can grow up to three metres long and weigh more than 70 kilograms.",
      "(2) Komodo dragons are carnivores. They eat almost any kind of meat, from small animals to large deer and wild pigs. They usually hunt by ambushing their prey and then delivering a powerful bite. For many years, people believed that bacteria in the dragon's mouth killed the prey. However, more recent research suggests that the lizard has venom glands in its lower jaw that prevent blood from clotting and cause the prey to go into shock.",
      "(3) Today, the Komodo dragon is classified as an endangered species. Rising sea levels, habitat loss, and a decline in prey threaten its survival. Komodo National Park was established in 1980 to protect the dragons and their habitat, and it was later recognised as a UNESCO World Heritage Site.",
    ] } },
    { t: "Reading – text type", l: 1, q: "What type of text is Text 2?", o: ["Report", "Narrative", "Procedure", "Recount"], e: "It presents general factual information about a class of animal → a report text." },
    { t: "Reading – main idea", l: 2, q: "What is the main idea of paragraph 2?", o: ["The Komodo dragon's diet and way of hunting", "The size of the Komodo dragon", "The places where Komodo dragons live", "The threats to the Komodo dragon"], e: "Paragraph 2 discusses what the dragon eats and how it hunts and kills its prey." },
    { t: "Reading – detail", l: 2, q: "According to recent research, what causes the prey to go into shock?", o: ["Venom from glands in the lizard's lower jaw", "Bacteria in the lizard's mouth", "The lizard's large body weight", "A lack of food on the islands"], e: "‘…the lizard has venom glands in its lower jaw that prevent blood from clotting and cause the prey to go into shock.’" },
    { t: "Reading – reference", l: 1, q: "The word “it” in “it was later recognised as a UNESCO World Heritage Site” refers to …", o: ["Komodo National Park", "the Komodo dragon", "the habitat", "the decline in prey"], e: "The subject of the clause is Komodo National Park." },
    { t: "Reading – not mentioned", l: 2, q: "Which information is NOT mentioned in the text?", o: ["How long Komodo dragons can live", "Where Komodo dragons can be found", "What Komodo dragons eat", "Why Komodo dragons are endangered"], e: "Life span is never mentioned; the other three are discussed in paragraphs 1–3." },
    { t: "Reading – inference (HOTS)", l: 3, q: "Based on paragraph 3, protecting deer and wild pig populations on the islands would most likely …", o: ["help the Komodo dragon survive", "make the Komodo dragon more dangerous", "cause sea levels to rise", "reduce the size of the national park"], e: "A decline in prey is one of the threats; protecting prey animals reduces that threat." },

    { part: "Functional Expressions (questions 11–13)." },
    { t: "Expression – congratulating", l: 1, q: ["Rina : “I won first place in the speech contest!”", "Dimas : “……”"], o: ["Congratulations! You really deserve it.", "I'm sorry to hear that.", "Never mind. Try again next time.", "Thank you very much."], e: "Responding to good news → expression of congratulation." },
    { t: "Expression – asking opinion", l: 1, q: ["Andi : “…… about our school's new online learning platform?”", "Sari : “I think it's very helpful.”"], o: ["What do you think", "How do you do", "Where did you go", "When will you finish"], e: "Sari gives an opinion, so Andi asks for an opinion: ‘What do you think about …?’" },
    { t: "Expression – offering help", l: 1, q: ["Mrs. Lina is carrying a pile of books.", "Budi : “……”", "Mrs. Lina : “That's very kind of you. Thank you.”"], o: ["Would you like me to help you?", "Could you help me, please?", "Do you mind if I borrow a book?", "May I go home now?"], e: "Mrs. Lina thanks Budi for his kindness, so Budi offers help." },

    { part: "Grammar (questions 14–21)." },
    { t: "Grammar – simple present (fact)", l: 1, q: "Water …… at 100 °C at sea level.", o: ["boils", "boiled", "is boiling", "boil"], e: "General truth → simple present; singular subject → ‘boils’." },
    { t: "Grammar – present perfect", l: 2, q: "Siti …… in Bogor since 2020.", o: ["has lived", "lives", "lived", "is live"], e: "‘Since 2020’ (from the past until now) → present perfect." },
    { t: "Grammar – past continuous", l: 2, q: "When the lights went out last night, we …… dinner.", o: ["were having", "have", "are having", "had had"], e: "An action in progress interrupted by another past action → past continuous." },
    { t: "Grammar – passive voice", l: 2, q: "The new bridge …… by the government last year.", o: ["was built", "is built", "built", "has built"], e: "‘Last year’ + passive → was/were + past participle." },
    { t: "Grammar – conditional type 1", l: 2, q: "If it rains tomorrow, we …… the football match.", o: ["will postpone", "postponed", "would postpone", "would have postponed"], e: "Real/possible future condition → If + simple present, will + V1." },
    { t: "Grammar – comparative", l: 1, q: "Mount Everest is …… than Mount Kilimanjaro.", o: ["higher", "highest", "more high", "the highest"], e: "Comparison of two things with ‘than’ → comparative ‘higher’." },
    { t: "Grammar – relative pronoun", l: 2, q: "The student …… won the national olympiad is my cousin.", o: ["who", "which", "whom", "whose"], e: "‘Who’ replaces a person acting as the subject of the clause." },
    { t: "Grammar – error recognition", l: 3, keep: true, a: 0, q: "She don't like spicy food, but her brother enjoys it very much. The incorrect part of the sentence is …", o: ["don't", "spicy food", "but", "enjoys"], e: "Third-person singular subject ‘She’ requires ‘doesn't’." },

    { part: "Vocabulary (questions 22–25)." },
    { t: "Vocabulary – synonym", l: 1, q: "The elephant is an enormous animal. The word “enormous” has the same meaning as ……", o: ["huge", "tiny", "fast", "gentle"], e: "Enormous = very large = huge." },
    { t: "Vocabulary – antonym", l: 1, q: "The museum displays ancient tools. The opposite of “ancient” is ……", o: ["modern", "old", "historic", "broken"], e: "Ancient (very old) is the opposite of modern." },
    { t: "Vocabulary – context", l: 2, q: "Dina was so …… after the long hike that she fell asleep during the movie.", o: ["exhausted", "excited", "hungry", "curious"], e: "Falling asleep implies she was very tired → exhausted." },
    { t: "Vocabulary – sentence arrangement", l: 2, q: "Arrange the words: to – library – every – goes – the – Rudi – Saturday", o: ["Rudi goes to the library every Saturday.", "Rudi every Saturday goes the library to.", "Every Rudi goes to the Saturday library.", "The library goes to Rudi every Saturday."], e: "Subject + verb + place + time: ‘Rudi goes to the library every Saturday.’" },
  ],
};
