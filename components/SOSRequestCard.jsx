import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
export default function SOSRequestCard({ lat, long, date, id, deleteHandler }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{date}</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    <span className="font-bold underline">Latitude :</span>
                    {lat}
                </p>
                <p>
                    <span className="font-bold underline">Longitude :</span>
                    {long}
                </p>
            </CardContent>
            <CardFooter>
                <Button
                    variant="destructive"
                    onClick={() => deleteHandler({ _id: id })}
                >
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}
