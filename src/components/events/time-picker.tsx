import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../ui/button";

interface timePickerProps {
  reservableId: string;
  onSelected: (date: Date) => void;
}

export default function TimePicker(props: timePickerProps) {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const timeSlots =
    api.hackathon.getTimeSlots.useQuery(props.reservableId).data ?? [];

  const selectTime = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    date: Date
  ) => {
    event.preventDefault();
    setSelectedTime(date);
    props.onSelected(date);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {timeSlots.map((date) => (
        <Button
          key={date.toString()}
          onClick={(event) => selectTime(event, date)}
          variant={
            date.valueOf() === selectedTime?.valueOf() ? "default" : "outline"
          }
        >
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Button>
      ))}
    </div>
  );
}
