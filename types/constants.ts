
import { z } from "zod";
export const COMP_NAME = "MyComp";
export const TextClipSchema = z.object({
  id: z.string(),
  type: z.literal('text'),
  properties: z.object({
    animationType: z.string(),
    // subtype: z.string(),
    fontFamily: z.string(),
    fontSize: z.number(),
    fontWeight: z.string(),
    textColor: z.string(),
    textAlign: z.string(),
    width: z.number(),
    height: z.number(),
    text: z.string(),
    opacity: z.number(),
    start: z.number(),
    duration: z.number(),
    top: z.number(),
    left: z.number(),
    zindex: z.number(),
    rotation: z.number(),
    textDecorationLine: z.string(),
    textTransform: z.string(),
    letterSpacing: z.number(),
    lineHeight: z.number(),
    fontstyle: z.string(),
    isDragging: z.boolean(),

  }),
});

export const ImageClipSchema = z.object({
  id: z.string(),
  type: z.literal('image'),
  properties: z.object({
    animationType: z.string(),
    src: z.string(),
    width: z.number(),
    height: z.number(),
    opacity: z.number(),
    start: z.number(),
    duration: z.number(),
    maxWidth: z.number(),
    maxHeight: z.number(),
    objectFit: z.string(),
    top: z.number(),
    left: z.number(),
    zindex: z.number(),
    contrast: z.number(),
    hueRotate: z.number(),
    saturate: z.number(),
    blur: z.number(),
    grayscale: z.number(),
    sepia: z.number(),
    brightness: z.number(),
    rotation: z.number(),
    borderRadius: z.string(),
    transform: z.string(),
    isDragging: z.boolean(),


  }),
});

export const VideoClipSchema = z.object({
  id: z.string(),
  type: z.literal('video'),
  properties: z.object({
    src: z.string(),
    duration: z.number(),
    start: z.number(),
    top: z.number(),
    left: z.number(),
    width: z.number(),
    height: z.number(),
    zindex: z.number(),
    TrimStart: z.number(),
    TrimEnd: z.number(),
    rotation: z.number(),
    volume: z.number(),
    isDragging: z.boolean(),
    borderRadius: z.string(),
    transform: z.string(),
    videothumbnail: z.string(),

  }),
});

export const CaptionClipSchema = z.object({
  id: z.string(),
  type: z.literal('caption'),
  properties: z.object({
    src: z.string(),
    duration: z.number(),
    start: z.number(),
    top: z.number(),
    left: z.number(),
    width: z.number(),
    height: z.number(),
    zindex: z.number(),
    TrimStart: z.number(),
    TrimEnd: z.number(),
    rotation: z.number(),
    volume: z.number(),
    isDragging: z.boolean(),
    videothumbnail: z.string(),

  }),
});

const CaptionSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  timestampMs: z.number().nullable(),
  confidence: z.number().nullable(),
})

export const CaptionTextClipSchema = z.object({
  id: z.string(),
  type: z.literal('captiontext'),
  properties: z.object({
    src: z.string(),
    caption_url: z.array(CaptionSchema),
    duration: z.number(),
    start: z.number(),
    top: z.number(),
    left: z.number(),
    width: z.number(),
    height: z.number(),
    zindex: z.number(),
    TrimStart: z.number(),
    TrimEnd: z.number(),
    rotation: z.number(),
    volume: z.number(),
    isDragging: z.boolean(),
    videothumbnail: z.string(),

  }),
});



export const AudioClipSchema = z.object({
  id: z.string(),
  type: z.literal('audio'),
  properties: z.object({
    src: z.string(),
    duration: z.number(),
    start: z.number(),
    volume: z.number(),
    top: z.number(),
    left: z.number(),
    width: z.number(),
    height: z.number(),
    zindex: z.number(),
    rotation: z.number(),

    isDragging: z.boolean(),

  }),
});


export const AudioWaveClipSchema = z.object({
  id: z.string(),
  type: z.literal('audiowave'),
  properties: z.object({
    src: z.string(),
    duration: z.number(),
    start: z.number(),
    volume: z.number(),
    top: z.number(),
    left: z.number(),
    width: z.number(),
    height: z.number(),
    zindex: z.number(),
    rotation: z.number(),

    isDragging: z.boolean(),
    audioOffsetInSeconds: z.number(),
    audioFileName: z.string(),
    onlyDisplayCurrentSentence: z.boolean(),
    waveColor: z.string(),
    waveFreqRangeStartIndex: z.number(),
    waveLinesToDisplay: z.number(),
    waveNumberOfSamples: z.string(),
    mirrorWave: z.boolean(),

  }),
});

export const EmojiClipSchema = z.object({
  id: z.string(),
  type: z.literal('emoji'),
  properties: z.object({
    animationType: z.string(),
    src: z.string().url(),
    start: z.number(),
    duration: z.number(),
    top: z.number(),
    left: z.number(),
    width: z.number(),
    rotation: z.number(),
    height: z.number(),
    zindex: z.number(),
    opacity: z.number(),
    fill: z.string(),
    stroke: z.string(),
    strokeWidth: z.number(),
    filter: z.string(),
    cursor: z.string(),
    svgtext: z.string(),
    transition: z.string(),
    color: z.string(),
    transform: z.string(),
    isDragging: z.boolean(),

  }),
});

export const GifClipSchema = z.object({
  id: z.string(),
  type: z.literal('gif'),
  properties: z.object({
    src: z.string().url(),
    start: z.number(),
    duration: z.number(),
    top: z.number(),
    left: z.number(),
    width: z.number(),
    rotation: z.number(),
    height: z.number(),
    zindex: z.number(),
    cursor: z.string(),
    isDragging: z.boolean(),

  }),
});
const WatermarkSchema = z.object({
  watermark_url: z.string().url(), 
  watermark_permission: z.boolean(), 
});

export const CompositionProps = z.object({
  durationInFrames: z.number(),
  videoWidth: z.number(),
  videoHeight: z.number(),
  videobg: z.string(),
  Watermark: z.array(WatermarkSchema),
  Allclips: z.array(z.union([TextClipSchema, ImageClipSchema, VideoClipSchema, AudioClipSchema, AudioWaveClipSchema, EmojiClipSchema, GifClipSchema, CaptionClipSchema, CaptionTextClipSchema])),
});


export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  durationInFrames: 300,
  videoWidth: 1080,
  videoHeight: 1080,
  videobg: "#ffffff",
  Allclips: [],
  Watermark:[],
};

// Constants
export const VIDEO_FPS = 30;
