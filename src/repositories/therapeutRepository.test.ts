import { therapeutFactory } from "factories/therapeut";
import { TherapeutRepository } from "./therapeutRepository";
import { db } from "@/initialize";


describe("TherapeutRepository", () => {
    describe("#all", () => {
        it("returns a list of all therapeuts", async () => {
            const therapeut = await therapeutFactory.create();
            const therapeutRepository = new TherapeutRepository();
            const therapeuts = await therapeutRepository.all();

            expect(therapeuts).toEqual([therapeut]);
        });
    });

    describe("#save", () => {
        it("creates a new therapeut if id is not provided", async () => {
            const therapeutData = therapeutFactory.build();
            const therapeutRepository = new TherapeutRepository(db);
            const savedTherapeut = await therapeutRepository.save(therapeutData);

            expect(savedTherapeut).toMatchObject(therapeutData);
            // check if there is an entry in the db
            const all = await db.selectFrom("therapeuts").selectAll().where("id", "=", savedTherapeut.id).execute();
            expect(all.length).toBe(1);
        });

        it("updates an existing therapeut if id is provided", async () => {
            const therapeut = await therapeutFactory.create();
            const therapeutRepository = new TherapeutRepository(db);
            const updatedData = { ...therapeut, name: "Updated Name" };
            const savedTherapeut = await therapeutRepository.save(updatedData);

            expect(savedTherapeut).toMatchObject(updatedData);
            // check if there is an entry in the db
            const all = await db.selectFrom("therapeuts").selectAll().where("id", "=", savedTherapeut.id).execute();
            expect(all.length).toBe(1);
            expect(all[0].name).toBe("Updated Name");
        });
    });
});