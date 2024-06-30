// import {prisma} from "@backend/prisma";
// import QuizAnswer from "@/components/QuizAnswer";
// import QuizForm from "@/components/QuizForm";
// import Timer from "@/components/Timer";

// export default async function Page({ params }: { params: { room: string } }) {
//     const player = await prisma.player.findUnique({
//         where: {id: params.room[1]},
//     });
//     if (player) {
//         console.log("Fetched successfully");
//         console.log(player);
        
//       } else {
//         console.log("Error in finding it.");
//     }
    
//     // return <div>My Post: {params.room[1]}</div>
    
//     return <div className="border-gray-300 border-2 rounded-md mt-40 m-24  flex flex-col items-center justify-center p-10 text-center">
//         <h1>Hello {params.room[0]}</h1>
//         {/* <QuizForm roomName={params.room[0]}/> */}
//     </div>
//     // return <div>{player?.role === 'TEACHER' ? <QuizForm/> : <QuizAnswer/>}</div>
// }

import { prisma } from "@backend/prisma";
import RoomPage from "@/components/RoomPage";

export default async function Page({ params }: { params: { room: string } }) {
    const player = await prisma.player.findUnique({
        where: { id: params.room[1] },
    });

    if (!player) {
        console.log("Error in finding it.");
        return <div>Error: Player not found</div>;
    }

    return (
        <RoomPage
            playerRole={player.role}
            roomName={params.room[0]}
        />
    );
}
