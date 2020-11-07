const getTodayDate = require("../../utils/get-today-date");

describe("get-today-date",()=>{
    test("Should return properly formatted date", () =>{
        const newDate = new Date('December 25, 1995 23:15:30');
        const formattedDate = getTodayDate(newDate)
        expect(formattedDate).toBe("1995-12-25")

        const formattedToday = getTodayDate(new Date())
        expect(formattedToday).toBe("2020-11-6")

    })
})