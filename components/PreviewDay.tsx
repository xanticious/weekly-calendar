interface PreviewDayProps {
  date: {
    weekday: string;
    month: string;
    day: string;
  };
  text?: string;
}

const Line = ({ text }: { text?: string }) => {
  if (text) {
    return (
      <div className="text-gray-700 text-sm font-chewy border-b border-gray-300 pb-0.5 w-full text-center">
        {text}
      </div>
    );
  }

  return <div className="border-b border-gray-300 h-4 w-full"></div>;
};

export default function PreviewDay({ date, text }: PreviewDayProps) {
  const lines = [];

  lines.push(<Line key={0} text={text} />);

  // More lines to better represent actual paper space - about 35-40 lines per day column
  for (let i = 1; i < 38; i++) {
    lines.push(<Line key={i} />);
  }

  return (
    <div className="bg-white p-3 h-full flex flex-col min-h-0">
      <div className="font-semibold font-chewy text-gray-800 mb-2 text-sm flex-shrink-0">
        {date.weekday} - {date.month} {date.day}
      </div>
      <div className="space-y-1 flex-1 min-h-0">{lines}</div>
    </div>
  );
}
