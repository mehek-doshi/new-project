/* Question bank for the Neuleap Aptitude Assessment · Round 1 (30 questions, 3 sections). */
window.TA_SECTIONS = [
  {
    id: 1,
    name: "Quantitative Aptitude",
    minutes: 15,
    questions: [
      {
        text: "A shopkeeper marks an item 40% above its cost price and then gives a discount of 15% on the marked price. What is his profit percentage?",
        options: ["19%", "21%", "23%", "25%"],
        answer: 0
      },
      {
        text: "Two pipes can fill a tank in 12 hours and 18 hours respectively. If both pipes are opened together, how long will it take to fill the tank?",
        options: ["6 hours", "7.2 hours", "7.5 hours", "8 hours"],
        answer: 1
      },
      {
        text: "The average of five consecutive odd numbers is 27. What is the largest of these numbers?",
        options: ["29", "31", "33", "35"],
        answer: 1
      },
      {
        type: "chart",
        lead: "The pie chart shows how a company’s ₹48 lakh annual budget is split across five departments. Study the chart and answer the question.",
        chart: {
          title: "Annual budget by department (%)",
          slices: [
            { label: "R&D", value: 30, color: "var(--blue-100)" },
            { label: "Operations", value: 25, color: "var(--green-100)" },
            { label: "Marketing", value: 20, color: "var(--amber-100)" },
            { label: "HR", value: 15, color: "var(--violet-100)" },
            { label: "Admin", value: 10, color: "var(--red-100)" }
          ]
        },
        text: "How much more is spent on R&D than on HR?",
        options: ["₹4.8 lakh", "₹6.0 lakh", "₹7.2 lakh", "₹9.6 lakh"],
        answer: 2
      },
      {
        text: "A train 240 m long passes a pole in 12 seconds. How long will it take to pass a platform 360 m long?",
        options: ["24 seconds", "28 seconds", "30 seconds", "36 seconds"],
        answer: 2
      },
      {
        text: "Simple interest on a sum for 3 years at 8% per annum is ₹1,920. What is the sum?",
        options: ["₹7,200", "₹8,000", "₹8,400", "₹9,600"],
        answer: 1
      },
      {
        text: "The ratio of boys to girls in a class is 5 : 3. If there are 40 students, how many girls must join so the ratio becomes 1 : 1?",
        options: ["8", "10", "12", "15"],
        answer: 1
      },
      {
        text: "A can finish a job in 10 days and B in 15 days. They work together for 4 days, then A leaves. In how many more days will B finish the job?",
        options: ["3 days", "4 days", "5 days", "6 days"],
        answer: 2
      },
      {
        text: "If 3x + 7 = 2x + 15, what is the value of 2x − 4?",
        options: ["10", "12", "14", "16"],
        answer: 1
      },
      {
        text: "A number is increased by 20% and then decreased by 20%. The net change is:",
        options: ["No change", "4% increase", "4% decrease", "2% decrease"],
        answer: 2
      }
    ]
  },
  {
    id: 2,
    name: "Logical Reasoning",
    minutes: 15,
    questions: [
      {
        type: "code",
        text: "What is printed when this program runs?",
        language: "C++",
        code: [
          "#include <iostream>",
          "using namespace std;",
          "",
          "int main() {",
          "    int a = 6, b = 10;",
          "    a = a ^ b;",
          "    b = a ^ b;",
          "    a = a ^ b;",
          "    cout << a << \" \" << b;",
          "    return 0;",
          "}"
        ],
        hint: "^ is the bitwise XOR operator.",
        options: ["6 10", "10 6", "12 12", "0 0"],
        answer: 1
      },
      {
        text: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
        options: ["38", "40", "42", "44"],
        answer: 2
      },
      {
        text: "All roses are flowers. Some flowers fade quickly. Which conclusion definitely follows?",
        options: ["All roses fade quickly", "Some roses fade quickly", "No rose fades quickly", "None of the above follows"],
        answer: 3
      },
      {
        text: "If CODE is written as DPEF, how is LOGIC written in the same code?",
        options: ["MPHJD", "MPHJC", "MOHJD", "NPHJD"],
        answer: 0
      },
      {
        text: "Pointing to a man, Riya says, “He is the only son of my grandfather’s only son.” How is the man related to Riya?",
        options: ["Father", "Uncle", "Brother", "Cousin"],
        answer: 2
      },
      {
        text: "A clock shows 3:15. What is the angle between the hour and minute hands?",
        options: ["0°", "7.5°", "15°", "22.5°"],
        answer: 1
      },
      {
        text: "Which word does not belong with the others?",
        options: ["Square", "Triangle", "Circle", "Cube"],
        answer: 3
      },
      {
        text: "Arjun walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the start?",
        options: ["3 km", "5 km", "8 km", "13 km"],
        answer: 0
      },
      {
        text: "In a row of 40 students, Meera is 14th from the left. What is her position from the right?",
        options: ["25th", "26th", "27th", "28th"],
        answer: 2
      },
      {
        text: "If ‘+’ means ‘×’, ‘×’ means ‘−’, and ‘−’ means ‘+’, what is 8 + 3 × 4 − 2?",
        options: ["18", "20", "22", "26"],
        answer: 2
      }
    ]
  },
  {
    id: 3,
    name: "Verbal Ability",
    minutes: 15,
    questions: [
      {
        text: "Choose the word closest in meaning to ‘METICULOUS’.",
        options: ["Careless", "Thorough", "Hasty", "Generous"],
        answer: 1
      },
      {
        text: "Choose the word opposite in meaning to ‘SCARCE’.",
        options: ["Rare", "Plentiful", "Limited", "Costly"],
        answer: 1
      },
      {
        text: "Fill in the blank: The committee has ___ its decision until next week.",
        options: ["deferred", "differed", "referred", "inferred"],
        answer: 0
      },
      {
        text: "Identify the part with an error: ‘Each of the players / have been given / a new jersey / for the final.’",
        options: ["Each of the players", "have been given", "a new jersey", "for the final"],
        answer: 1
      },
      {
        text: "Choose the correctly spelt word.",
        options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"],
        answer: 2
      },
      {
        text: "What does the idiom ‘to bite the bullet’ mean?",
        options: ["To act aggressively", "To face something difficult bravely", "To speak without thinking", "To avoid responsibility"],
        answer: 1
      },
      {
        text: "Choose the one word for: ‘a person who speaks many languages’.",
        options: ["Linguist", "Polyglot", "Orator", "Translator"],
        answer: 1
      },
      {
        text: "Rearrange to form a sentence: (P) the results (Q) were announced (R) of the exam (S) yesterday",
        options: ["PRQS", "PQRS", "RPQS", "QPRS"],
        answer: 0
      },
      {
        text: "Choose the correct passive form: ‘The manager approved the budget.’",
        options: ["The budget is approved by the manager.", "The budget was approved by the manager.", "The budget had approved the manager.", "The budget has been approved by manager."],
        answer: 1
      },
      {
        text: "Choose the word that best completes the analogy — Author : Novel :: Composer : ?",
        options: ["Orchestra", "Symphony", "Instrument", "Concert"],
        answer: 1
      }
    ]
  }
];
