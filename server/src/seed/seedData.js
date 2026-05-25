const Provider = require("../models/Provider");
const AllocationState = require("../models/AllocationState");

const seedData = async () => {
    try {

        const providerCount = await Provider.countDocuments();

        if (providerCount === 0) {

            await Provider.insertMany([
                {
                    name: "Provider 1",
                    services: ["Service 1", "Service 3"],
                },
                {
                    name: "Provider 2",
                    services: ["Service 1", "Service 3"],
                },
                {
                    name: "Provider 3",
                    services: ["Service 1", "Service 3"],
                },
                {
                    name: "Provider 4",
                    services: ["Service 1", "Service 3"],
                },
                {
                    name: "Provider 5",
                    services: ["Service 2", "Service 3"],
                },
                {
                    name: "Provider 6",
                    services: ["Service 2", "Service 3"],
                },
                {
                    name: "Provider 7",
                    services: ["Service 2", "Service 3"],
                },
                {
                    name: "Provider 8",
                    services: ["Service 2", "Service 3"],
                },
            ]);

            console.log("Providers Seeded");
        }

        const allocationCount = await AllocationState.countDocuments();

        if (allocationCount === 0) {

            await AllocationState.insertMany([
                {
                    serviceType: "Service 1",
                    currentIndex: 0,
                },
                {
                    serviceType: "Service 2",
                    currentIndex: 0,
                },
                {
                    serviceType: "Service 3",
                    currentIndex: 0,
                },
            ]);

            console.log("Allocation States Seeded");
        }

    } catch (error) {
        console.log("Seed Error:", error);
    }
};

module.exports = seedData;