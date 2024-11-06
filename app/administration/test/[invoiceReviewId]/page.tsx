interface Props {
  params: {
    invoiceReviewId: string;
  };
}

export default function Page({ params: { invoiceReviewId } }: Props) {
  return (
    <div className="w-full h-[100vh]">
      <iframe
        src={`https://drive.google.com/file/d/${invoiceReviewId}/preview`}
        width="100%"
        height="100%"
      />
    </div>
  );
}
