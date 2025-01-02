import dbConnect from '../db/connectDb';
import { StudentModel } from '../models/User';

class FriendDataHandler {
  async getFriends(student_id: string): Promise<{ student_id: string, name: string }[]> {
    await dbConnect();
    try {
      const result = await StudentModel.aggregate([
        {
          $match: {
            student_id: student_id,
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "friends",
            foreignField: "_id",
            as: "friends",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  student_id: 1,
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$friends",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $replaceRoot: { newRoot: "$friends" },
        },
      ]);
        return result.length > 0 ? result : [];
  
    } catch (error) {
      console.error("Error fetching friends:", error);
      throw new Error(`Error fetching friends for student_id ${student_id}: ${(error as Error).message}`);
    }
  }
}  

export default FriendDataHandler;

  //TESTT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// class FriendDataHandler {
//   async getFriends(student_id: string) {
//     if (student_id === studentData.student_id) {
//       return studentData.friends;

//     }
//     return [];
//   }
// }

// export default FriendDataHandler;
