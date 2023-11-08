import { IDL } from '@app-1699408735/anchor';

export default async function Index() {
  return (
    <div>
      <pre>{JSON.stringify(IDL, null, 2)}</pre>
    </div>
  );
}
