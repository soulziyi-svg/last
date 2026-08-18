import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { hasSupabaseConfig, supabase } from '../../lib/supabase';
import { FONTS } from '../../theme/tokens';

function AdminAuthGate({ children }) {
  const [session, setSession] = useState(undefined);
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const verifyAdmin = async (nextSession) => {
    setSession(nextSession);
    if (!nextSession?.user) return setAllowed(false);
    const { data, error: checkError } = await supabase.from('admin_users').select('user_id').eq('user_id', nextSession.user.id).maybeSingle();
    setAllowed(Boolean(data) && !checkError);
  };

  useEffect(() => {
    if (!hasSupabaseConfig) return setSession(null);
    supabase.auth.getSession().then(({ data }) => verifyAdmin(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => verifyAdmin(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    else {
      const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', data.user.id).maybeSingle();
      if (!admin) {
        await supabase.auth.signOut();
        setError('관리자 권한이 없는 계정입니다.');
      }
    }
    setLoading(false);
  };

  if (session === undefined) return <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  if (session && allowed) return children;

  return <Box sx={{ minHeight: '100vh', bgcolor: '#F4F2EE', display: 'grid', placeItems: 'center', p: 2, fontFamily: FONTS.pretendard }}>
    <Paper component="form" onSubmit={signIn} elevation={0} sx={{ width: '100%', maxWidth: 420, p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid rgba(23,23,23,.1)' }}>
      <Box sx={{ width: 54, height: 54, borderRadius: '50%', bgcolor: '#171717', color: '#fff', display: 'grid', placeItems: 'center', mx: 'auto', mb: 2 }}><LockOutlinedIcon /></Box>
      <Box sx={{ textAlign: 'center', fontWeight: 900, fontSize: 25 }}>관리자 로그인</Box>
      <Box sx={{ textAlign: 'center', color: '#74777F', fontSize: 13, mt: 1, mb: 4 }}>등록된 관리자만 접속할 수 있습니다.</Box>
      {!hasSupabaseConfig ? <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#FFF4D8', color: '#765500', fontSize: 13, lineHeight: 1.7 }}>.env.local 파일에 Supabase 주소와 공개 키를 설정해야 로그인을 사용할 수 있습니다.</Box> : <>
        <TextField label="관리자 이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required sx={{ mb: 2 }} />
        <TextField label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
        {error && <Box sx={{ color: '#D32F2F', fontSize: 13, mt: 1.5 }}>{error}</Box>}
        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 3, py: 1.4, bgcolor: '#171717', fontWeight: 900 }}>{loading ? '확인 중...' : '로그인'}</Button>
      </>}
    </Paper>
  </Box>;
}

export default AdminAuthGate;
