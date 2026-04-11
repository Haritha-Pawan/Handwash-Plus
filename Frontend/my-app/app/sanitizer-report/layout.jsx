export default function SanitizerReportLayout({ children }) {
  return (
    <>
      <style>{`
        nav { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
