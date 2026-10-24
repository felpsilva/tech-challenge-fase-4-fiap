import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';

import { ActionButton, Field, Header, Message, Page, SectionTitle, contentStyles } from '@/components/blog-ui';
import { postService } from '@/services/post-service';
import { Post } from '@/types/api';
import { useAuth } from '@/context/auth-context';
import { ThemedText } from '@/components/themed-text';
import { PostThumbnail } from '@/components/post-thumbnail';

export default function PostFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { session, canManageContent } = useAuth();
  const [post, setPost] = useState<Partial<Post>>({ status: 'published' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  useEffect(() => {
    if (id && session) postService.get(Number(id), session.token).then(setPost).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Falha ao carregar post.'));
  }, [id, session]);
  const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à biblioteca de imagens para escolher uma imagem.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.9,
    });
    if (!result.canceled) {
      const image = result.assets[0];
      if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
        Alert.alert('Imagem muito grande', 'Escolha uma imagem com no máximo 2 MB.');
        return;
      }
      setSelectedImage(image);
    }
  }
  async function save() {
    if (!session || !post.title || !post.content) return;
    setSaving(true); setError('');
    try {
      const input = { user_id: post.user_id ?? session.user.id, title: post.title, slug: post.slug ?? slugify(post.title), content: post.content, status: post.status ?? 'published' };
      const savedPost = id
        ? await postService.update(session.token, Number(id), input)
        : await postService.create(session.token, input);
      if (selectedImage) {
        await postService.uploadThumbnail(session.token, savedPost.id, {
          uri: selectedImage.uri,
          name: selectedImage.fileName ?? `post-${savedPost.id}.jpg`,
          type: selectedImage.mimeType ?? 'image/jpeg',
        });
      }
      router.replace('/admin/posts');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao salvar post.'); }
    finally { setSaving(false); }
  }
  if (!canManageContent) return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><Message>Você não tem permissão para acessar esta página.</Message></ScrollView></Page>;
  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><View style={{ gap: 16, maxWidth: 700, width: '100%', alignSelf: 'center' }}>
    <SectionTitle title={id ? 'Editar postagem' : 'Criar postagem'} description="Preencha os dados da publicação." />
    <Field label="Título" value={post.title ?? ''} onChangeText={(title) => setPost((current) => ({ ...current, title }))} />
    <Field label="Slug" value={post.slug ?? ''} onChangeText={(slug) => setPost((current) => ({ ...current, slug }))} placeholder="titulo-da-publicacao" />
    <Field label="Conteúdo" value={post.content ?? ''} onChangeText={(content) => setPost((current) => ({ ...current, content }))} multiline numberOfLines={8} textAlignVertical="top" />
    <Field label="Autor (ID)" value={String(post.user_id ?? session?.user.id ?? '')} onChangeText={(value) => setPost((current) => ({ ...current, user_id: Number(value) || undefined }))} keyboardType="number-pad" />
    <View style={styles.imageSection}>
      <ThemedText type="smallBold">Imagem destacada</ThemedText>
      <ThemedText type="small">JPEG, PNG ou WebP. Tamanho máximo: 2 MB. A imagem será usada na home e nesta edição.</ThemedText>
      {selectedImage ? (
        <Image source={{ uri: selectedImage.uri }} style={styles.preview} contentFit="cover" />
      ) : id && post.id ? (
        <PostThumbnail postId={post.id} version={post.updated_at} imageUrl={null} />
      ) : null}
      <View style={styles.imageActions}>
        <ActionButton variant="secondary" onPress={() => void pickImage()}>Escolher imagem</ActionButton>
        {selectedImage && <Pressable onPress={() => setSelectedImage(null)}><ThemedText style={styles.removeImage}>Remover seleção</ThemedText></Pressable>}
      </View>
    </View>
    {!!error && <Message>{error}</Message>}
    <ActionButton onPress={() => void save()} disabled={saving}>{saving ? 'Salvando...' : 'Salvar postagem'}</ActionButton>
  </View></ScrollView></Page>;
}

const styles = StyleSheet.create({
  imageSection: { gap: 8 },
  preview: { width: '100%', aspectRatio: 16 / 9, borderRadius: 10 },
  imageActions: { gap: 12, alignItems: 'flex-start' },
  removeImage: { color: '#B3261E', fontWeight: '700' },
});
