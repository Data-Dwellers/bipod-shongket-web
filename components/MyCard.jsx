import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "./ui/button";
export default function MyCard() {
    return (
        <Card className="w-80 h-90 ">
            <CardHeader className="text-2xl">Report Title :</CardHeader>
            <CardContent>Reported By :</CardContent>
            <CardContent>Report Discreaption :</CardContent>
            <CardFooter>
                <Button>Details</Button>
            </CardFooter>
        </Card>
    );
}
