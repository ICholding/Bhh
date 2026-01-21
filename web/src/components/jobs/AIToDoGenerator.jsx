import { base44 } from '@/api/base44Client';

export async function generateJobToDo(job, employeeId) {
  try {
    const prompt = `Generate a detailed step-by-step To-Do checklist for a healthcare worker:

Job Title: ${job.title}
Service Type: ${job.serviceType}
Duration: ${job.estimatedDurationMinutes} minutes
Requirements: ${job.requirements?.join(', ') || 'None specified'}
Special Instructions: ${job.specialInstructions || 'None'}
Scheduled Start: ${job.scheduledStart}

Create a comprehensive checklist that includes:
1. Pre-arrival preparation steps
2. On-arrival verification and safety checks
3. Core service delivery tasks
4. Documentation requirements
5. Wrap-up and sign-off procedures

${job.serviceType === 'PersonalCare' ? 'CRITICAL: Include safety checkpoints for personal care (hand hygiene, privacy, dignity).' : ''}
${job.specialInstructions?.toLowerCase().includes('medication') ? 'CRITICAL: Include medication reminder safety steps.' : ''}

Return a JSON array of steps, each with:
- title: Short task name
- description: Clear instructions
- estimatedMinutes: Time estimate
- requiresProof: true if documentation needed
- proofType: "Photo", "Note", "Signature", or "None"
- safetyWarning: Optional safety reminder

Be thorough but practical. Steps should be actionable.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                estimatedMinutes: { type: "number" },
                requiresProof: { type: "boolean" },
                proofType: { type: "string", enum: ["Photo", "Note", "Signature", "None"] },
                safetyWarning: { type: "string" }
              },
              required: ["title", "description", "estimatedMinutes", "requiresProof", "proofType"]
            }
          }
        }
      }
    });

    const stepsWithIds = response.steps.map((step, idx) => ({
      ...step,
      stepId: `step-${Date.now()}-${idx}`,
      status: 'Todo',
      proofValue: ''
    }));

    const jobToDo = await base44.entities.JobToDo.create({
      jobId: job.id,
      employeeId,
      generatedBy: 'AI',
      steps: stepsWithIds
    });

    await base44.entities.JobMessage.create({
      jobId: job.id,
      fromRole: 'AI',
      fromName: 'AI Assistant',
      message: `AI-generated To-Do checklist created with ${stepsWithIds.length} steps.`
    });

    return jobToDo;
  } catch (error) {
    console.error('AI ToDo generation failed:', error);
    
    const fallbackSteps = [
      {
        stepId: 'step-1',
        title: 'Arrive at Location',
        description: 'Arrive at the scheduled time and introduce yourself.',
        estimatedMinutes: 5,
        status: 'Todo',
        requiresProof: false,
        proofType: 'None',
        proofValue: ''
      },
      {
        stepId: 'step-2',
        title: 'Verify Client Identity',
        description: 'Confirm you are at the correct location and with the correct client.',
        estimatedMinutes: 2,
        status: 'Todo',
        requiresProof: true,
        proofType: 'Note',
        proofValue: ''
      },
      {
        stepId: 'step-3',
        title: 'Perform Service',
        description: `Complete the ${job.serviceType} service as outlined in the requirements.`,
        estimatedMinutes: job.estimatedDurationMinutes - 15,
        status: 'Todo',
        requiresProof: false,
        proofType: 'None',
        proofValue: ''
      },
      {
        stepId: 'step-4',
        title: 'Document Completion',
        description: 'Record any notes about the service provided.',
        estimatedMinutes: 5,
        status: 'Todo',
        requiresProof: true,
        proofType: 'Note',
        proofValue: ''
      },
      {
        stepId: 'step-5',
        title: 'Get Client Signature',
        description: 'Obtain client or family member signature confirming service completion.',
        estimatedMinutes: 3,
        status: 'Todo',
        requiresProof: true,
        proofType: 'Signature',
        proofValue: ''
      }
    ];

    const jobToDo = await base44.entities.JobToDo.create({
      jobId: job.id,
      employeeId,
      generatedBy: 'Template',
      steps: fallbackSteps
    });

    return jobToDo;
  }
}