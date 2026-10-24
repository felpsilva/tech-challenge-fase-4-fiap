import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ActionButton, Field, Header, Message, Page, SectionTitle, contentStyles } from '@/components/blog-ui';
import { categoryService } from '@/services/category-service';
import { useAuth } from '@/context/auth-context';

export default function CategoryFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>(); const { session, canManageContent } = useAuth();
  const [name, setName] = useState(''); const [slug, setSlug] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  useEffect(() => { if (id && session) categoryService.get(session.token, Number(id)).then((category) => { setName(category.name); setSlug(category.slug); }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Falha ao carregar categoria.')); }, [id, session]);
  async function save() { if (!session || !name || !slug) return; setSaving(true); setError(''); try { if (id) await categoryService.update(session.token, Number(id), { name, slug }); else await categoryService.create(session.token, { name, slug }); router.replace('/admin/categories'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao salvar categoria.'); } finally { setSaving(false); } }
  if (!canManageContent) return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><Message>Você não tem permissão para acessar esta página.</Message></ScrollView></Page>;
  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><View style={{ gap: 16, maxWidth: 600, width: '100%', alignSelf: 'center' }}><SectionTitle title={id ? 'Editar categoria' : 'Criar categoria'} /><Field label="Nome" value={name} onChangeText={setName} /><View style={{ gap: 8 }}><Field label="Slug" value={slug} onChangeText={setSlug} /><ActionButton variant="secondary" onPress={() => setSlug(slugify(name))}>Slugificar nome</ActionButton></View>{error && <Message>{error}</Message>}<ActionButton onPress={() => void save()} disabled={saving}>{saving ? 'Salvando...' : 'Salvar categoria'}</ActionButton></View></ScrollView></Page>;
}
