import { IDL } from '@app-1699408735/anchor';

export default async function Index() {
  return (
    <div>
      <pre style={{ fontSize: 'x-small' }}>{JSON.stringify(IDL, null, 2)}</pre>
    </div>
  );
}
