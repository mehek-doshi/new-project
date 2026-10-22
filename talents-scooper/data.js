/* Sample data for Talents Scooper. Names, roles and copy come from the Figma file. */
window.TS_DATA = (function () {
  var people = [
    ["Priya Sharma", "Data Engineer", "IIT Madras", 2.5, "2d"],
    ["Rohan Mehta", "Gen AI", "BITS Pilani", 1.5, "1d"],
    ["Ananya Iyer", "Gen AI", "NIT Trichy", 3, "3d"],
    ["Karan Verma", "Data Engineer", "VIT Vellore", 0.8, "4h"],
    ["Sara Khan", "UX Designer", "NID Ahmedabad", 2, "2d"],
    ["Vikram Rao", "Gen AI", "IIIT Hyderabad", 4, "5d"],
    ["Meera Nair", "Data Engineer", "College of Engineering, Pune", 1, "1d"],
    ["Arjun Das", "Gen AI", "Jadavpur University", 2.5, "6h"],
    ["Divya Pillai", "UX Designer", "Srishti Institute", 3.5, "3d"],
    ["Farhan Ali", "Data Engineer", "Delhi Technological University", 1.2, "2d"],
    ["Ishaan Gupta", "Gen AI", "IIT Bombay", 0.5, "8h"],
    ["Neha Kulkarni", "Data Engineer", "PICT Pune", 2.8, "4d"]
  ];

  var dates = ["17 August 2026", "16 August 2026", "15 August 2026", "14 August 2026", "12 August 2026", "11 August 2026"];

  var candidates = people.map(function (p, i) {
    return {
      id: "C" + (1034 + i),
      name: p[0],
      role: p[1],
      college: p[2],
      experience: p[3],
      aging: p[4],
      received: dates[i % dates.length],
      email: p[0].toLowerCase().replace(/\s+/g, ".") + "@email.com",
      phone: "+91 98" + (100 + i * 7) + " " + (40000 + i * 1311),
      location: ["Bengaluru", "Pune", "Chennai", "Hyderabad", "Mumbai", "Delhi NCR"][i % 6]
    };
  });

  function pick(ids) {
    return ids.map(function (i) { return candidates[i]; });
  }

  var pipeline = {
    new: pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).map(function (c, i) {
      var status = i % 4 === 3 ? "Failed" : i % 5 === 4 ? "-" : "Success";
      return Object.assign({}, c, {
        status: status,
        reason: status === "Failed" ? "Resume could not be parsed" : status === "-" ? "Queued for pipeline" : "-"
      });
    }),
    processing: pick([1, 2, 5, 7, 10, 11]).map(function (c, i) {
      return Object.assign({}, c, { stage: ["Screening", "Round 1", "Round 2", "Round 1", "Final Round", "Screening"][i] });
    }),
    hired: pick([0, 3, 6, 9]).map(function (c, i) {
      return Object.assign({}, c, {
        joining: ["21 August 2026", "1 September 2026", "8 September 2026", "15 September 2026"][i],
        offerLetter: i !== 3,
        offerReply: ["Accepted", "Accepted", "No Response", "Rejected"][i],
        bgVerified: i < 2,
        itAsset: i === 0,
        buddy: i < 3,
        induction: i === 0
      });
    }),
    undecided: [],
    rejected: pick([4, 8, 10, 11]).map(function (c) { return c; })
  };

  var interviewers = [
    { name: "Dinesh Anbarasan", load: 3, slots: ["Today 3:00 PM", "Today 5:30 PM", "Tomorrow 11:00 AM"] },
    { name: "Devansh Thakkar", load: 5, slots: ["Tomorrow 2:00 PM", "Fri 10:00 AM"] },
    { name: "Sandeep Varma", load: 1, slots: ["Today 4:00 PM", "Tomorrow 10:00 AM", "Tomorrow 4:30 PM"] },
    { name: "Abhay R", load: 2, slots: ["Tomorrow 12:00 PM", "Fri 3:00 PM"] },
    { name: "Abishekraswanth KR", load: 4, slots: ["Fri 11:30 AM"] }
  ];

  var schedule = [
    { name: "Priya Sharma", aging: "2d", role: "Data Engineer", stage: "Round 1", interviewer: "Dinesh Anbarasan", slot: "Open" },
    { name: "Rohan Mehta", aging: "1d", role: "Gen AI", stage: "Round 1", interviewer: "Abishekraswanth KR", slot: "Confirmed" },
    { name: "Ananya Iyer", aging: "3d", role: "Gen AI", stage: "Final Round", interviewer: "Sandeep Varma", slot: "Tentative" },
    { name: "Karan Verma", aging: "4h", role: "Data Engineer", stage: "Round 1", interviewer: "Devansh Thakkar", slot: "Busy" },
    { name: "Sara Khan", aging: "2d", role: "UX Designer", stage: "Round 1", interviewer: "Dinesh Anbarasan", slot: "Pending" },
    { name: "Vikram Rao", aging: "5d", role: "Gen AI", stage: "Round 2", interviewer: "Sandeep Varma", slot: "Confirmed" },
    { name: "Meera Nair", aging: "1d", role: "Data Engineer", stage: "Round 2", interviewer: "Devansh Thakkar", slot: "Open" },
    { name: "Arjun Das", aging: "6h", role: "Gen AI", stage: "Round 1", interviewer: "Abishekraswanth KR", slot: "Busy" },
    { name: "Divya Pillai", aging: "3d", role: "UX Designer", stage: "Final Round", interviewer: "Dinesh Anbarasan", slot: "Tentative" },
    { name: "Farhan Ali", aging: "2d", role: "Data Engineer", stage: "Round 1", interviewer: "Sandeep Varma", slot: "Open" }
  ];

  var banks = {
    topics: [
      "Python Libraries Aptitude",
      "SQL Aptitude",
      "Fast API",
      "Prompt Writing",
      "Analytical Thinking and Logical Reasoning",
      "Operations Research",
      "DSA Aptitude",
      "Data Engineering and Warehousing Aptitude"
    ],
    roles: ["Gen AI", "Data Engineering", "UX Design"],
    tags: ["RAG & Vector DBs", "Prompt Engineering", "Python Libraries", "LLM Evaluation", "FastAPI", "Data Engineering", "Operations Research", "Puzzles"],
    questions: [
      { text: "Which library would you use to serve a fine-tuned model as a REST API, and why?", tag: "Python Libraries", level: "Medium" },
      { text: "How would you design a prompt to reduce hallucination in a summarization task?", tag: "Prompt Engineering", level: "Medium" },
      { text: "How would you choose a chunking strategy for a RAG pipeline over legal documents?", tag: "RAG & Vector DBs", level: "Hard" },
      { text: "What metrics would you use to evaluate a chatbot's response quality beyond BLEU/ROUGE?", tag: "LLM Evaluation", level: "Medium" },
      { text: "In a FastAPI service, how do you handle a slow, blocking call inside an async endpoint without stalling the event loop?", tag: "FastAPI", level: "Hard" },
      { text: "In pandas/PySpark, what's the difference between an eager and a lazy transformation, and why does it matter for a data engineering pipeline?", tag: "Data Engineering", level: "Medium" },
      { text: "You must assign 5 engineers to 5 tasks to minimize total time. How do you model and solve it, and how does it differ from a transportation problem?", tag: "Operations Research", level: "Hard" },
      { text: "You have 9 identical-looking balls and one is heavier — how do you find it in the fewest weighings on a balance scale?", tag: "Puzzles", level: "Easy" }
    ],
    queue: [
      { name: "Priya Sharma", role: "Data Engineer", stage: "Round 1", interviewer: "Dinesh Anbarasan", assigned: false },
      { name: "Rohan Mehta", role: "Gen AI", stage: "Round 1", interviewer: "Abishekraswanth KR", assigned: false },
      { name: "Shubhangi S. Shailendra", role: "Gen AI", stage: "Final Round", interviewer: "Sandeep Varma", assigned: true },
      { name: "Karan Verma", role: "Data Engineer", stage: "Round 1", interviewer: "Devansh Thakkar", assigned: false },
      { name: "Sara Khan", role: "UX Designer", stage: "Round 1", interviewer: "Dinesh Anbarasan", assigned: false },
      { name: "Vikram Rao", role: "Gen AI", stage: "Round 2", interviewer: "Sandeep Varma", assigned: false },
      { name: "Meera Nair", role: "Data Engineer", stage: "Round 2", interviewer: "Devansh Thakkar", assigned: false },
      { name: "Arjun Das", role: "Gen AI", stage: "Round 1", interviewer: "Abishekraswanth KR", assigned: false },
      { name: "Divya Pillai", role: "UX Designer", stage: "Final Round", interviewer: "Dinesh Anbarasan", assigned: false },
      { name: "Farhan Ali", role: "Data Engineer", stage: "Round 1", interviewer: "Sandeep Varma", assigned: false }
    ]
  };

  var history = [
    { round: "Screening", role: "Gen AI", by: "Dinesh Anbarasan", date: "13 June 2026", note: "Good candidate, strong Gen AI knowledge.", result: "Passed" },
    { round: "Round 1", role: "Gen AI", by: "Sampath Shetty", date: "18 June 2026", note: "Solid problem-solving; needs more depth on system design.", result: "Passed" },
    { round: "Round 2", role: "Gen AI", by: "Not assigned", date: "24 June 2026", note: "", result: "Pending" }
  ];

  var profile = {
    summary: "Early-career AI Engineer with hands-on experience in LLM systems, RAG, and scalable AI application development.",
    analysis: [
      { title: "Fresher or Experienced", score: 5, text: "The candidate is EXPERIENCED (Lateral), with qualifying roles as AI Engineer at Aug AI (since Nov 2025) and Software Engineer at Zaple India Technologies (April–Nov 2025), totaling over 9 months of professional experience." },
      { title: "Graduation & Window", score: 4, text: "The highest completed undergraduate degree is B.Sc (Chemistry), completed in 2019. The years to consider since then is 7 (2026 - 2019). The candidate is currently pursuing a BS in Data Science and Applications (2022–current)." },
      { title: "Career Start & Gap", score: 3, text: "The candidate's first qualifying full-time role started in Sept 2020 at Bhavani Assaying and Hallmarking Center. There is a gap of approximately 14 months between graduation (July 2019) and first job (Sept 2020)." },
      { title: "Company Projects", score: 4, text: "Company projects include an image similarity search system (DINOv2, FAISS), a RAG-based LLM application (BAAI/bge-m3, LLaMA), and scalable AI model serving (FastAPI) at Aug AI. These projects demonstrate hands-on GenAI and deployment skills." },
      { title: "Industry Certifications", score: 1, text: "None. No industry-grade vendor certifications (Databricks, AWS, Azure, GCP, etc.) are present." }
    ],
    certifications: ["SAP Certified: SAP AI Developer"],
    education: { college: "D.Y. Patil Agriculture & Technical University, Kolhapur", degree: "Bachelor’s", cgpa: "8.3", passout: "2025" },
    audit: [
      { at: "18 June 2026, 4:12 PM", by: "Sampath Shetty", text: "Moved to Round 2" },
      { at: "13 June 2026, 6:40 PM", by: "Dinesh Anbarasan", text: "Moved to Round 1" },
      { at: "11 June 2026, 9:05 AM", by: "Pipeline", text: "Resume parsed and scored (4.1 / 5)" }
    ]
  };

  return {
    candidates: candidates,
    pipeline: pipeline,
    interviewers: interviewers,
    schedule: schedule,
    banks: banks,
    history: history,
    profile: profile,
    moveTo: ["Move to Screening Round", "Move to Round 1", "Move to Round 2", "Move to Final Round", "Move to Final Round (In-office)", "Directly Hire"]
  };
})();
