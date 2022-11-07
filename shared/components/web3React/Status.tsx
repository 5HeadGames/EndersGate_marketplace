export function Status({
  isActivating,
  isActive,
  error,
}: {
  isActivating: ReturnType<any>;
  isActive: ReturnType<any>;
  error?: Error;
}) {
  return (
    <div>
      {error ? (
        <>
          🔴 {error.name ?? "Error"}
          {error.message ? `: ${error.message}` : null}
        </>
      ) : isActivating ? (
        <>🟡 Connecting</>
      ) : isActive ? (
        <>🟢 Connected</>
      ) : (
        <>⚪️ Disconnected</>
      )}
    </div>
  );
}
