const logger = require("../logger");

exports.invokeAI = async (req, res) => {
  const { prompt } = req.body;
  logger.info({ prompt_snippet: prompt?.substring(0, 150) }, 'AI Invoke Controller Triggered');

  const isAnalysis = prompt?.toLowerCase().includes("analyze") || prompt?.toLowerCase().includes("report");
  const isScheduling = prompt?.toLowerCase().includes("schedule") || prompt?.toLowerCase().includes("time");

  let mockResponse = {
    suggestedRole: "Caregiver",
    flags: [],
    activitySummary: "Standard activity detected.",
    recommendedActions: ["Maintain routine monitoring"]
  };

  if (isAnalysis) {
    mockResponse = {
      suggestedRole: "Supervisor",
      flags: [{ type: "INFO", message: "Compliance review suggested" }],
      activitySummary: "System analysis indicates high operational throughput.",
      recommendedActions: ["Validate credential logs", "Verify visit verification signatures"]
    };
  } else if (isScheduling) {
    mockResponse = {
      suggestedRole: "Dispatcher",
      flags: [{ type: "WARNING", message: "Conflict detected in morning slots" }],
      activitySummary: "Schedule optimization required for efficient coverage.",
      recommendedActions: ["Auto-resolve overlaps", "Notify primary caregiver"]
    };
  }

  setTimeout(() => res.json(mockResponse), 600);
};
