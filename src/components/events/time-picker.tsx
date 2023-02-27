import generateTimeSlots from "~/lib/generate-time-slots";
import { api } from "~/utils/api";
import { Button } from "../ui/button";

interface timePickerProps {
  // date: string;
  // startTime: string;
  // endTime: string;
  // interval: number;
  reservableId: string;
}

export default function TimePicker(props: timePickerProps) {
  const timeSlots =
    api.hackathon.getTimeSlots.useQuery(props.reservableId).data ?? [];
  // const { date, startTime, endTime, interval } = props;

  // const startDate = new Date(`${date}T${startTime}`);
  // const endDate = new Date(`${date}T${endTime}`);
  // const timeSlots = generateTimeSlots(startDate, endDate, interval);
  return (
    <div className="grid grid-cols-3 gap-4">
      {timeSlots.map((date) => (
        <Button key={date.toString()}>
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Button>
      ))}
    </div>
  );
}
