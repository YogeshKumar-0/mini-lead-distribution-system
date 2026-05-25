const Provider = require("../models/Provider");
const Assignment = require("../models/Assignment");
const AllocationState = require("../models/AllocationState");

const mandatoryProviders = {
    "Service 1": ["Provider 1"],
    "Service 2": ["Provider 5"],
    "Service 3": ["Provider 1", "Provider 4"],
};

const providerPools = {
    "Service 1": [
        "Provider 2",
        "Provider 3",
        "Provider 4",
    ],

    "Service 2": [
        "Provider 6",
        "Provider 7",
        "Provider 8",
    ],

    "Service 3": [
        "Provider 2",
        "Provider 3",
        "Provider 5",
        "Provider 6",
        "Provider 7",
        "Provider 8",
    ],
};

const allocateLead = async (lead) => {

    const assignedProviders = [];

    const mandatory =
        mandatoryProviders[lead.serviceType];

    for (const providerName of mandatory) {

        const provider = await Provider.findOneAndUpdate(
            {
                name: providerName,

                $expr: {
                    $lt: ["$usedQuota", "$monthlyQuota"],
                },
            },
            {
                $inc: {
                    usedQuota: 1,
                },
            },
            {
                returnDocument: "after",
            }
        );

        if (provider) {

            assignedProviders.push(provider);

            await Assignment.create({
                leadId: lead._id,
                providerId: provider._id,
            });
        }
    }

    const remainingSlots =
        3 - assignedProviders.length;

    if (remainingSlots <= 0) {
        return assignedProviders;
    }

    const pool = providerPools[lead.serviceType];

    let assignedCount = 0;

    let attempts = 0;

    const maxAttempts = pool.length * 2;

    while (
        assignedCount < remainingSlots &&
        attempts < maxAttempts
    ) {

        attempts++;

        const allocationState =
            await AllocationState.findOneAndUpdate(
                {
                    serviceType: lead.serviceType,
                },
                {
                    $inc: {
                        currentIndex: 1,
                    },
                },
                {
                    returnDocument: "after",
                }
            );

        const index =
            (allocationState.currentIndex - 1)
            % pool.length;

        const providerName = pool[index];

        const provider = await Provider.findOne({
            name: providerName,
        });

        if (!provider) {
            continue;
        }

        const alreadyAssigned =
            assignedProviders.find(
                (p) =>
                    p._id.toString() ===
                    provider._id.toString()
            );

        if (alreadyAssigned) {
            continue;
        }

        const updatedProvider =
            await Provider.findOneAndUpdate(
                {
                    _id: provider._id,

                    $expr: {
                        $lt: [
                            "$usedQuota",
                            "$monthlyQuota",
                        ],
                    },
                },
                {
                    $inc: {
                        usedQuota: 1,
                    },
                },
                {
                    returnDocument: "after",
                }
            );

        if (!updatedProvider) {
            continue;
        }

        assignedProviders.push(updatedProvider);

        await Assignment.create({
            leadId: lead._id,
            providerId: updatedProvider._id,
        });

        assignedCount++;
    }

    global.io.emit("leadAssigned", {
        leadId: lead._id,
    });

    return assignedProviders;
};

module.exports = allocateLead;