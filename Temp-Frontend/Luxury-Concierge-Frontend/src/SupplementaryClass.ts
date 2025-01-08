import UserInterface from "./interfaces/UserInterface";

class Supplementaries{

    static serverLink = "http://localhost:8080/"
    static clientLink = "http://localhost:5173/"

    static generateUserJson(id:number = NaN, username:string = "", password:string = "", firstname:string = "", 
        lastname:string = "", email:string = "", address:string = "", birthday:Date = new Date() ) : UserInterface
    {
        return {
            "userId":id,
            "username":username,
            "password": password,
            "first_name": firstname,
            "last_name" : lastname,
            "email" : email,
            "address" : address,
            "birthday" : birthday
        }
    }


    static generateDateRanges(numRanges:number) {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 2); // 2 years ago
        
        const dateRanges = [];
      
        for (let i = 0; i < numRanges; i++) {
          // Generate random start date within the last 2 years
          const randomStart = new Date(startDate.getTime() + Math.random() * (today.getTime() - startDate.getTime()));
          
          // Generate random end date within 30 days of the start date
          const randomEnd = new Date(randomStart.getTime() + Math.random() * (30 * 24 * 60 * 60 * 1000)); // 30 days
          
          
          // Format dates as 'yy-mm-dd'
          const formattedStart = randomStart.toISOString().split('T')[0].slice(2); // Format: yy-mm-dd
          const formattedEnd = randomEnd.toISOString().split('T')[0].slice(2);
      
          // Add the date range to the array
          dateRanges.push({ start_date: formattedStart, end_date: formattedEnd });
        }

        return dateRanges;
      }

    static sortDates(dateList : any){
        dateList.sort((a : any, b : any) => {
            const dateA : any= new Date(`20${a.start_date}`);
            const dateB :any= new Date(`20${b.start_date}`);
            return dateA - dateB;
        });
        
    }

    static filterDateRangesBefore(data:any,distance:number){
            let dateRanges = [];
            for(let i = 0; i < data.length; i++){
                const start_date = new Date(`20${data[i].end_date}`)
                const farthest_date = new Date()
                farthest_date.setDate(farthest_date.getDate() - distance)

                if(start_date >= farthest_date ){
                    dateRanges.push(data[i])
                }
            }   
            return dateRanges;
    }

    static filterDateRangesAfterToday(data:any){
        let dateRanges = [];
            for(let i = 0; i < data.length; i++){
                const end_date = new Date(`20${data[i].end_date}`)
                const earliest_date = new Date()
                earliest_date.setDate(earliest_date.getDate() + 1)

                if(end_date < earliest_date ){
                    dateRanges.push(data[i])
                }
            }   
            return dateRanges;
    }
    

    static CreateOccupencyCount(data:any){
        const dailyCount:any = {};

        // Step 1: Process the input data
        data.forEach((booking:any) => {
            const startDate:any = new Date(`20${booking.start_date}`);
            const endDate:any = new Date(`20${booking.end_date}`);
            const peopleCount:any = 1;

            // Add people count to the start date
            dailyCount[startDate.toISOString().split('T')[0]] = (dailyCount[startDate.toISOString().split('T')[0]] || 0) + peopleCount;

            // Subtract people count on the day after the end date
            const nextDay = new Date(endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            dailyCount[nextDay.toISOString().split('T')[0]] = (dailyCount[nextDay.toISOString().split('T')[0]] || 0) - peopleCount;
        });

        // Step 2: Sort the dates and accumulate the counts
        const allDates = Object.keys(dailyCount).sort();
        let accumulatedCount = 0;
        const result:any = {};

        allDates.forEach(date => {
            accumulatedCount += dailyCount[date];
            result[date] = accumulatedCount;
        });

        return result;
    }

    

    static ConvertOccupancyCountJsonToList(data: any) :any[]{
        const finalArray = [];

        for(const key in data){
            finalArray.push({day:key,count:data[key]})
        }

        return finalArray;
    }

}

export default Supplementaries