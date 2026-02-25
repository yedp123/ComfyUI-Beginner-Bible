// 1. THIS TELLS US IF THE BROWSER EVEN DOWNLOADED THE FILE
console.log("📖 [Beginner Bible] Script file loaded by browser!");

import { app } from "../../scripts/app.js";

// Global tracker for drag-and-drop to bypass LiteGraph's aggressive event blocking
let draggedNodeId = null;

// === THE FULL DATABASE (136 NODES) ===
const nodes = [
    // === LOADERS ===
    {
        n: "Checkpoint Loader (Simple)",
        id: "CheckpointLoaderSimple",
        t: "Loader",
        d: "This is the 'Start' button. It loads the AI 'Brain' (Model), the 'Eyes' that read text (CLIP), and the 'Translator' (VAE).",
        u: "<strong>How to use:</strong> Add this first. Select a filename. Connect the 3 outputs (Model, CLIP, VAE)."
    },
    {
        n: "Load Checkpoint With Config (DEPRECATED)",
        id: "CheckpointLoader",
        t: "Loader",
        d: "An old, obsolete version of the Checkpoint Loader.",
        u: "<strong>How to use:</strong> Don't use this unless an old tutorial forces you to. Use 'Checkpoint Loader (Simple)' instead."
    },
    {
        n: "CLIP Loader",
        id: "CLIPLoader",
        t: "Loader",
        d: "Loads the 'Text Reader' separately from the main brain. Essential for new models like Flux or SD3.",
        u: "<strong>How to use:</strong> Connect the output to a 'CLIP Text Encode' node."
    },
    {
        n: "Dual CLIP Loader",
        id: "DualCLIPLoader",
        t: "Loader",
        d: "Loads two Text Readers at once. SDXL and Flux need this.",
        u: "<strong>How to use:</strong> Used for SDXL/Flux. Load 't5xxl' in one slot and 'clip_l' in the other."
    },
    {
        n: "QuadrupleCLIPLoader",
        id: "QuadrupleCLIPLoader", 
        t: "Loader",
        d: "Loads 4 Text Readers. Only for very complex, experimental setups.",
        u: "<strong>How to use:</strong> You probably won't need this yet."
    },
    {
        n: "UNET Loader",
        id: "UNETLoader",
        t: "Loader",
        d: "Loads just the 'Visual Brain' (Diffusion Model), without the text reader or pixel translator.",
        u: "<strong>How to use:</strong> Advanced. Use this to mix-and-match a specific brain with a different text reader."
    },
    {
        n: "VAE Loader",
        id: "VAELoader",
        t: "Loader",
        d: "Loads the 'Pixel Translator'. The VAE translates Latent -> Pixels.",
        u: "<strong>How to use:</strong> If your images look washed out/grey, load a specific VAE here."
    },
    {
        n: "Lora Loader",
        id: "LoraLoader",
        t: "Loader",
        d: "A 'Plugin' for the AI. Adds a specific style, character, or concept.",
        u: "<strong>How to use:</strong> Put this *after* your Checkpoint Loader."
    },
    {
        n: "Lora Loader Model Only",
        id: "LoraLoaderModelOnly", 
        t: "Loader",
        d: "Loads a LoRA but only affects the visual style, ignoring text triggers.",
        u: "<strong>How to use:</strong> Use if a LoRA is ruining your prompt comprehension."
    },
    {
        n: "ControlNet Loader (DEPRECATED)",
        id: "ControlNetLoader",
        t: "Loader",
        d: "Loads a 'Guide'. Tells the AI to follow the shape of an input image.",
        u: "<strong>How to use:</strong> Connect to 'Apply ControlNet'. Needs .pth files."
    },
    {
        n: "Diff ControlNet Loader",
        id: "DiffControlNetLoader", 
        t: "Loader",
        d: "A specialized loader for 'Differential' ControlNets.",
        u: "<strong>How to use:</strong> Rare. Stick to the standard 'ControlNet Loader'."
    },
    {
        n: "GLIGEN Loader",
        id: "GLIGENLoader", 
        t: "Loader",
        d: "Loads a model that lets you draw boxes to tell the AI where to put things.",
        u: "<strong>How to use:</strong> Connect to 'GLIGEN Text Box Apply'."
    },
    {
        n: "Style Model Loader",
        id: "StyleModelLoader", 
        t: "Loader",
        d: "Loads a model that can copy the artistic style of a reference image.",
        u: "<strong>How to use:</strong> Connect to 'Apply Style Model'."
    },
    {
        n: "CLIP Vision Loader",
        id: "CLIPVisionLoader", 
        t: "Loader",
        d: "Gives the AI 'Eyes' to see images, not just text.",
        u: "<strong>How to use:</strong> Essential for 'Image-to-Image' guidance."
    },
    {
        n: "unCLIP Checkpoint Loader",
        id: "unCLIPCheckpointLoader", 
        t: "Loader",
        d: "Loads older SD 2.1 unCLIP models.",
        u: "<strong>How to use:</strong> Mostly obsolete."
    },
    {
        n: "Diffusers Loader",
        id: "DiffusersLoader", 
        t: "Loader",
        d: "Loads a model from a folder of many files instead of one big file.",
        u: "<strong>How to use:</strong> Use if your model is a directory, not a .safetensors file."
    },
    {
        n: "Hypernetwork Loader",
        id: "HypernetworkLoader", 
        t: "Loader",
        d: "Ancient technology. The ancestor of LoRAs.",
        u: "<strong>How to use:</strong> Don't use this. Use 'Lora Loader' instead."
    },
    {
        n: "Upscale Model Loader",
        id: "UpscaleModelLoader",
        t: "Loader",
        d: "Loads a tool to make images bigger and sharper (like 4x-UltraSharp).",
        u: "<strong>How to use:</strong> Connect to 'Image Upscale with Model'."
    },
    {
        n: "Image Only Checkpoint Loader (img2vid)",
        id: "ImageOnlyCheckpointLoader", 
        t: "Loader",
        d: "Loads a video-specific model (SVD).",
        u: "<strong>How to use:</strong> The starting point for generating video."
    },

    // === CONDITIONING ===
    {
        n: "CLIP Text Encode (Prompt)",
        id: "CLIPTextEncode",
        t: "Conditioning",
        d: "The Text Box. This is where you type what you want.",
        u: "<strong>How to use:</strong> You need TWO: Positive and Negative."
    },
    {
        n: "CLIP Text Encode SDXL",
        id: "CLIPTextEncodeSDXL", 
        t: "Conditioning",
        d: "A Text Box specifically for SDXL. Defines resolution.",
        u: "<strong>How to use:</strong> Fill in the width/height."
    },
    {
        n: "CLIP Text Encode SDXL Refiner",
        id: "CLIPTextEncodeSDXLRefiner", 
        t: "Conditioning",
        d: "Text box for the 'Refiner' (a polish pass).",
        u: "<strong>How to use:</strong> Has an 'Aesthetic Score'."
    },
    {
        n: "CLIP Text Encode Hunyuan DiT",
        id: "CLIPTextEncodeHunyuanDiT", 
        t: "Conditioning",
        d: "Text box for the Chinese Hunyuan model.",
        u: "<strong>How to use:</strong> Connect to Hunyuan Checkpoints only."
    },
    {
        n: "CLIPTextEncodeFlux",
        id: "CLIPTextEncodeFlux", 
        t: "Conditioning",
        d: "Text box for Flux models.",
        u: "<strong>How to use:</strong> Flux listens very carefully. Be descriptive."
    },
    {
        n: "FluxGuidance",
        id: "FluxGuidance", 
        t: "Conditioning",
        d: "A controller for Flux that decides how strictly to follow your prompt.",
        u: "<strong>How to use:</strong> Value 3.5 is standard."
    },
    {
        n: "Conditioning Set Timestep Range",
        id: "ConditioningSetTimestepRange", 
        t: "Conditioning",
        d: "Tells the AI: 'Only listen to this prompt at the beginning/end.'",
        u: "<strong>How to use:</strong> Set start=0, end=0.5 for rough sketch phase."
    },
    {
        n: "Conditioning Zero Out",
        id: "ConditioningZeroOut", 
        t: "Conditioning",
        d: "Makes the prompt empty/blank.",
        u: "<strong>How to use:</strong> See what the AI dreams about when given ZERO instructions."
    },
    {
        n: "Stable Zero 123 Conditioning",
        id: "StableZero123_Conditioning", 
        t: "Conditioning",
        d: "Instructions for rotating 3D objects.",
        u: "<strong>How to use:</strong> Used with Stable Zero models."
    },
    {
        n: "Stable Zero 123 Conditioning Batched",
        id: "StableZero123_Conditioning_Batched", 
        t: "Conditioning",
        d: "Same as above, but for multiple objects at once.",
        u: "<strong>How to use:</strong> Use for bulk 3D rotation generation."
    },
    {
        n: "CLIP Set Last Layer",
        id: "CLIPSetLastLayer", 
        t: "Conditioning",
        d: "Also known as 'Clip Skip'. Stops reading text layers early.",
        u: "<strong>How to use:</strong> -1 for Photo, -2 for Anime."
    },
    {
        n: "CLIP Vision Encode",
        id: "CLIPVisionEncode", 
        t: "Conditioning",
        d: "Turns an image into data the AI can understand.",
        u: "<strong>How to use:</strong> Connect output to a 'Style Model'."
    },
    {
        n: "Conditioning Average",
        id: "ConditioningAverage", 
        t: "Conditioning",
        d: "Mixes two text prompts together perfectly.",
        u: "<strong>How to use:</strong> Input 'Cat' and 'Dog' (0.5) = 50% Cat/Dog."
    },
    {
        n: "Conditioning (Combine)",
        id: "ConditioningCombine", 
        t: "Conditioning",
        d: "Stacks prompts on top of each other.",
        u: "<strong>How to use:</strong> Useful to add a 'Global Negative Prompt'."
    },
    {
        n: "Conditioning (Concat)",
        id: "ConditioningConcat", 
        t: "Conditioning",
        d: "Glues two prompts together into one long sentence.",
        u: "<strong>How to use:</strong> Advanced. Used to overcome word limits."
    },
    {
        n: "Conditioning (Set Area)",
        id: "ConditioningSetArea", 
        t: "Conditioning",
        d: "Tells the prompt: 'Only draw this in the top-left corner'.",
        u: "<strong>How to use:</strong> Define pixel coordinates."
    },
    {
        n: "Conditioning (Set Area with Percentage)",
        id: "ConditioningSetAreaPercentage", 
        t: "Conditioning",
        d: "Same as above, but uses percentages.",
        u: "<strong>How to use:</strong> Easier to use than pixels."
    },
    {
        n: "Conditioning (Set Area Strength)",
        id: "ConditioningSetAreaStrength", 
        t: "Conditioning",
        d: "Makes a specific area prompt weaker or stronger.",
        u: "<strong>How to use:</strong> Prevent prompt bleeding."
    },
    {
        n: "Conditioning (Set Mask)",
        id: "ConditioningSetMask", 
        t: "Conditioning",
        d: "Uses a custom shape (Mask) to decide where a prompt works.",
        u: "<strong>How to use:</strong> Draw a mask over a shirt. Connect 'Red Shirt' prompt."
    },
    {
        n: "Apply ControlNet",
        id: "ControlNetApply",
        t: "Conditioning",
        d: "The 'Tracing Paper' node. Forces the AI to follow the lines/depth of an input image.",
        u: "<strong>How to use:</strong> Inputs: Positive Prompt, ControlNet Model, Image."
    },
    {
        n: "Apply ControlNet (Advanced)",
        id: "ControlNetApplyAdvanced", 
        t: "Conditioning",
        d: "ControlNet, but lets you tell it when to stop.",
        u: "<strong>How to use:</strong> Set 'End' to 0.8 to let AI be creative at the end."
    },
    {
        n: "GLIGEN Text Box Apply",
        id: "GLIGENTextBoxApply", 
        t: "Conditioning",
        d: "Draw a box, type a word. The object appears in that box.",
        u: "<strong>How to use:</strong> Input coordinates and a text like 'Apple'."
    },
    {
        n: "Inpaint Model Conditioning",
        id: "InpaintModelConditioning", 
        t: "Conditioning",
        d: "Special instructions for 'Inpainting'.",
        u: "<strong>How to use:</strong> ONLY use if checkpoint name ends with 'inpainting'."
    },
    {
        n: "Apply Style Model",
        id: "StyleModelApply", 
        t: "Conditioning",
        d: "Applies an artistic style from a reference image.",
        u: "<strong>How to use:</strong> Load Style Model + Reference Image (CLIP Vision)."
    },
    {
        n: "unCLIP Conditioning",
        id: "unCLIPConditioning", 
        t: "Conditioning",
        d: "Advanced mixing for unCLIP models.",
        u: "<strong>How to use:</strong> Rare."
    },
    {
        n: "SD_4X Upscale Conditioning",
        id: "SD_4XUpscale_Conditioning", 
        t: "Conditioning",
        d: "Required instructions for the 'SD 4x Upscaler' model.",
        u: "<strong>How to use:</strong> Only connect to specialized SD 4x Upscaler model."
    },
    {
        n: "SVD img2vid Conditioning",
        id: "SVD_img2vid_Conditioning", 
        t: "Conditioning",
        d: "The steering wheel for video generation.",
        u: "<strong>How to use:</strong> Motion Bucket ID: Higher = More movement."
    },
    {
        n: "WanFunControlToVideo",
        id: "WanFunControlToVideo", 
        t: "Conditioning",
        d: "Controls for the specific 'Wan' video model.",
        u: "<strong>How to use:</strong> Controls frames and motion flow."
    },

    // === SAMPLING ===
    {
        n: "KSampler",
        id: "KSampler",
        t: "Sampling",
        d: "The Main Renderer. Takes noise and turns it into a picture.",
        u: "<strong>How to use:</strong> Connect Model, Prompts, Latent. Output to VAE Decode."
    },
    {
        n: "KSampler (Advanced)",
        id: "KSamplerAdvanced",
        t: "Sampling",
        d: "A Renderer that lets you interrupt the process.",
        u: "<strong>How to use:</strong> Use 'Return Noise' to pass image to another sampler."
    },
    {
        n: "SamplerCustom",
        id: "SamplerCustom", 
        t: "Sampling",
        d: "A DIY Renderer.",
        u: "<strong>How to use:</strong> Inputs for specific Noise, Guider, Sampler."
    },
    {
        n: "KSampler Select",
        id: "KSamplerSelect", 
        t: "Sampling",
        d: "A dropdown menu to pick a sampler type.",
        u: "<strong>How to use:</strong> Connect to 'SamplerCustom'."
    },
    {
        n: "Sampler DPMPP_2M_SDE",
        id: "SamplerDPMPP_2M_SDE", 
        t: "Sampling",
        d: "A specific rendering algorithm. High quality, adds texture.",
        u: "<strong>How to use:</strong> Great for realism."
    },
    {
        n: "Sampler DPMPP_SDE",
        id: "SamplerDPMPP_SDE", 
        t: "Sampling",
        d: "Another rendering algorithm. Slower but detailed.",
        u: "<strong>How to use:</strong> Good for complex textures."
    },
    {
        n: "Basic Scheduler",
        id: "BasicScheduler", 
        t: "Sampling",
        d: "Decides how fast noise is removed. 'Basic' is a straight line.",
        u: "<strong>How to use:</strong> Standard setting."
    },
    {
        n: "Exponential Scheduler",
        id: "ExponentialScheduler", 
        t: "Sampling",
        d: "Removes noise slowly at first, then fast.",
        u: "<strong>How to use:</strong> Good for 'Deep Fry' effects."
    },
    {
        n: "Karras Scheduler",
        id: "KarrasScheduler", 
        t: "Sampling",
        d: "The Gold Standard. Pleasing to human eyes.",
        u: "<strong>How to use:</strong> Use for 90% of your generations."
    },
    {
        n: "Polyexponential Scheduler",
        id: "PolyexponentialScheduler", 
        t: "Sampling",
        d: "A complex math curve for noise removal.",
        u: "<strong>How to use:</strong> Experimental."
    },
    {
        n: "SD Turbo Scheduler",
        id: "SDTurboScheduler", 
        t: "Sampling",
        d: "Super-fast scheduler for 'Turbo' models.",
        u: "<strong>How to use:</strong> ONLY use with SDXL Turbo (1-4 steps)."
    },
    {
        n: "VP Scheduler",
        id: "VPScheduler", 
        t: "Sampling",
        d: "Virtual Prediction. A specific math curve.",
        u: "<strong>How to use:</strong> Required for Video models (SVD)."
    },
    {
        n: "Flip Sigmas",
        id: "FlipSigmas", 
        t: "Sampling",
        d: "Reverses the rendering process.",
        u: "<strong>How to use:</strong> Can turn an image back into noise."
    },
    {
        n: "Split Sigmas",
        id: "SplitSigmas", 
        t: "Sampling",
        d: "Cuts the rendering process into two parts.",
        u: "<strong>How to use:</strong> 50% one sampler, 50% another."
    },
    {
        n: "Sampler",
        id: "", 
        t: "Sampling",
        d: "A generic box for a sampler algorithm (like Sampler LMS, Sampler EulerAncestral, Sampler DPMPP_2M_SDE, etc.).",
        u: "<strong>How to use:</strong> Connects to SamplerCustom."
    },
    {
        n: "Video Linear CFG Guidance",
        id: "VideoLinearCFGGuidance", 
        t: "Sampling",
        d: "A patch for Video Models to fix colors.",
        u: "<strong>How to use:</strong> Without this, SVD videos look 'burned'."
    },
    {
        n: "Model Sampling Continuous EDM",
        id: "ModelSamplingContinuousEDM", 
        t: "Sampling",
        d: "A mathematical way to handle noise steps.",
        u: "<strong>How to use:</strong> Modern K-Diffusion setups."
    },
    {
        n: "Model Sampling Discrete",
        id: "ModelSamplingDiscrete", 
        t: "Sampling",
        d: "The classic way to handle noise steps.",
        u: "<strong>How to use:</strong> Standard for SD 1.5."
    },
    {
        n: "Rescale CFG",
        id: "RescaleCFG", 
        t: "Sampling",
        d: "Prevents image burn when strict prompt following is used.",
        u: "<strong>How to use:</strong> Allows high CFG (20) without deep-frying."
    },

    // === IMAGE ===
    {
        n: "Empty Image",
        id: "EmptyImage", 
        t: "Image",
        d: "Creates a solid color square.",
        u: "<strong>How to use:</strong> Backgrounds or mask colors."
    },
    {
        n: "Image Batch",
        id: "ImageBatch", 
        t: "Image",
        d: "Stacks images like a deck of cards.",
        u: "<strong>How to use:</strong> Necessary for video processing."
    },
    {
        n: "Image From Batch",
        id: "ImageFromBatch", 
        t: "Image",
        d: "Pulls one card out of the deck.",
        u: "<strong>How to use:</strong> Extract Frame #50 from a video."
    },
    {
        n: "Rebatch Images",
        id: "RebatchImages", 
        t: "Image",
        d: "Reshuffles the deck.",
        u: "<strong>How to use:</strong> Turn two batches of 4 into one batch of 8."
    },
    {
        n: "Repeat Image Batch",
        id: "RepeatImageBatch", 
        t: "Image",
        d: "Photocopies the image multiple times.",
        u: "<strong>How to use:</strong> Turn 1 image into a 10-frame 'video'."
    },
    {
        n: "Image Composite Masked",
        id: "ImageCompositeMasked", 
        t: "Image",
        d: "Photoshop's 'Layer Mask'. Puts Image A on top of Image B.",
        u: "<strong>How to use:</strong> White part of mask shows Image A."
    },
    {
        n: "Invert Image",
        id: "ImageInvert", 
        t: "Image",
        d: "Swaps colors. White becomes Black.",
        u: "<strong>How to use:</strong> Creating masks from B&W drawings."
    },
    {
        n: "Image Pad For Outpainting",
        id: "ImagePadForOutpaint", 
        t: "Image",
        d: "Adds empty space around your image.",
        u: "<strong>How to use:</strong> Add space, then Inpaint to fill it."
    },
    {
        n: "Image Blend",
        id: "ImageBlend", 
        t: "Image",
        d: "Crossfades two images.",
        u: "<strong>How to use:</strong> Blend factor 0.5 = Ghost mix."
    },
    {
        n: "Image Blur",
        id: "ImageBlur", 
        t: "Image",
        d: "Makes the image fuzzy.",
        u: "<strong>How to use:</strong> Soften inpainting edges."
    },
    {
        n: "Image Quantize",
        id: "ImageQuantize", 
        t: "Image",
        d: "Reduces the number of colors.",
        u: "<strong>How to use:</strong> 8-bit/Retro look."
    },
    {
        n: "Image Sharpen",
        id: "ImageSharpen", 
        t: "Image",
        d: "Makes edges crisp.",
        u: "<strong>How to use:</strong> Run after upscaling."
    },
    {
        n: "Canny Node",
        id: "Canny", 
        t: "Image",
        d: "A 'Line Detector'. Turns a photo into a sketch.",
        u: "<strong>How to use:</strong> Connect output to 'ControlNet Apply'."
    },
    {
        n: "Image Crop",
        id: "ImageCrop", 
        t: "Image",
        d: "Cuts out a rectangular piece of the image.",
        u: "<strong>How to use:</strong> Extract just a face or object."
    },
    {
        n: "Image Scale",
        id: "ImageScale",
        t: "Image",
        d: "Resizes an image.",
        u: "<strong>How to use:</strong> 'bicubic' for standard, 'nearest' for pixel art."
    },
    {
        n: "Image Scale By Node",
        id: "ImageScaleBy", 
        t: "Image",
        d: "Resizes by a multiplier (e.g., 2x).",
        u: "<strong>How to use:</strong> Easy resizing without math."
    },
    {
        n: "Image Scale To Total Pixels",
        id: "ImageScaleToTotalPixels", 
        t: "Image",
        d: "Resizes to a safe size for your video card.",
        u: "<strong>How to use:</strong> Shrink image to 1 megapixel."
    },
    {
        n: "Image Upscale With Model",
        id: "ImageUpscaleWithModel",
        t: "Image",
        d: "The 'Enhance' button. Uses AI to make images bigger.",
        u: "<strong>How to use:</strong> Connect 'Upscale Model Loader' and Image."
    },
    {
        n: "Join Image with Alpha",
        id: "JoinImageWithAlpha", 
        t: "Image",
        d: "Combines color image + mask into transparent PNG.",
        u: "<strong>How to use:</strong> Save images with transparency."
    },
    {
        n: "Porter-Duff Image Composite",
        id: "PorterDuffImageComposite", 
        t: "Image",
        d: "Advanced blending math.",
        u: "<strong>How to use:</strong> Photoshop blending modes."
    },
    {
        n: "Split Image with Alpha",
        id: "SplitImageWithAlpha", 
        t: "Image",
        d: "Separates colors from transparency.",
        u: "<strong>How to use:</strong> Takes transparent PNG, gives RGB + Mask."
    },

    // === MASK ===
    {
        n: "Crop Mask",
        id: "CropMask", 
        t: "Mask",
        d: "Cuts out a piece of the mask.",
        u: "<strong>How to use:</strong> Focus processing on a specific area."
    },
    {
        n: "Feather Mask",
        id: "FeatherMask", 
        t: "Mask",
        d: "Blurs the edges of the mask.",
        u: "<strong>How to use:</strong> ESSENTIAL for Inpainting blending."
    },
    {
        n: "Grow Mask",
        id: "GrowMask", 
        t: "Mask",
        d: "Makes the mask bigger or smaller.",
        u: "<strong>How to use:</strong> Grow by 4-10px for Inpainting."
    },
    {
        n: "Image Color To Mask",
        id: "ImageColorToMask", 
        t: "Mask",
        d: "Greenscreen tool. Selects a specific color.",
        u: "<strong>How to use:</strong> Pick 'Green' for transparency."
    },
    {
        n: "Image To Mask",
        id: "ImageToMask", 
        t: "Mask",
        d: "Converts brightness to transparency.",
        u: "<strong>How to use:</strong> Darker pixels become transparent."
    },
    {
        n: "Invert Mask",
        id: "InvertMask", 
        t: "Mask",
        d: "Flips the selection.",
        u: "<strong>How to use:</strong> Invert 'Cat' to select 'Everything EXCEPT Cat'."
    },
    {
        n: "Load Image (as Mask)",
        id: "LoadImageMask", 
        t: "Mask",
        d: "Loads a black and white image to use as a selection.",
        u: "<strong>How to use:</strong> Load PNG shape to tell AI where to draw."
    },
    {
        n: "Mask Composite",
        id: "MaskComposite", 
        t: "Mask",
        d: "Math for masks.",
        u: "<strong>How to use:</strong> Combine two masks (Add/Multiply)."
    },
    {
        n: "Mask To Image",
        id: "MaskToImage", 
        t: "Mask",
        d: "Lets you see the mask as a picture.",
        u: "<strong>How to use:</strong> Debugging tool."
    },
    {
        n: "Solid Mask",
        id: "SolidMask", 
        t: "Mask",
        d: "Creates a square mask.",
        u: "<strong>How to use:</strong> Create full white mask to select everything."
    },

    // === LATENT ===
    {
        n: "Empty Latent Image",
        id: "EmptyLatentImage",
        t: "Latent",
        d: "The Blank Canvas. Determines image resolution.",
        u: "<strong>How to use:</strong> Connect to KSampler. Set width/height."
    },
    {
        n: "VAE Encode",
        id: "VAEEncode",
        t: "Latent",
        d: "Compressor. Turns Pixel Image -> Latent Noise.",
        u: "<strong>How to use:</strong> Required for 'Img2Img'."
    },
    {
        n: "VAE Decode",
        id: "VAEDecode",
        t: "Latent",
        d: "Decompressor. Turns Latent Noise -> Pixel Image.",
        u: "<strong>How to use:</strong> Final step. Output to 'Save Image'."
    },
    {
        n: "VAE Encode (for Inpainting)",
        id: "VAEEncodeForInpaint", 
        t: "Latent",
        d: "Smart Compressor. Takes image AND mask.",
        u: "<strong>How to use:</strong> Tells KSampler: 'Keep black parts exact'."
    },
    {
        n: "Latent Upscale",
        id: "LatentUpscale", 
        t: "Latent",
        d: "Stretches latent noise. Fast but blurry.",
        u: "<strong>How to use:</strong> Must run KSampler afterwards (Hires Fix)."
    },
    {
        n: "Latent Upscale By",
        id: "LatentUpscaleBy", 
        t: "Latent",
        d: "Stretches latent by a multiplier.",
        u: "<strong>How to use:</strong> Scale 1.5 is sweet spot."
    },
    {
        n: "Latent Composite",
        id: "LatentComposite", 
        t: "Latent",
        d: "Paste one latent on top of another.",
        u: "<strong>How to use:</strong> Stitch backgrounds together."
    },
    {
        n: "Latent Composite Masked",
        id: "LatentCompositeMasked", 
        t: "Latent",
        d: "Paste latent using a mask.",
        u: "<strong>How to use:</strong> Stitching characters into scenes."
    },
    {
        n: "Latent Add",
        id: "LatentAdd", 
        t: "Latent",
        d: "Mixes two latents together.",
        u: "<strong>How to use:</strong> Linear Dodge for AI data. Chaotic."
    },
    {
        n: "Latent Subtract",
        id: "LatentSubtract", 
        t: "Latent",
        d: "Removes one latent from another.",
        u: "<strong>How to use:</strong> Subtract a concept from an image."
    },
    {
        n: "Latent Multiply",
        id: "LatentMultiply", 
        t: "Latent",
        d: "Multiplies contrast.",
        u: "<strong>How to use:</strong> Makes features stronger."
    },
    {
        n: "Latent Interpolate",
        id: "LatentInterpolate", 
        t: "Latent",
        d: "Morphs Image A into Image B.",
        u: "<strong>How to use:</strong> 0.5 gives perfect hybrid."
    },
    {
        n: "Latent Batch",
        id: "LatentBatch", 
        t: "Latent",
        d: "Groups latents together.",
        u: "<strong>How to use:</strong> Upscale multiple prompts at once."
    },
    {
        n: "Latent From Batch",
        id: "LatentFromBatch", 
        t: "Latent",
        d: "Extracts one latent.",
        u: "<strong>How to use:</strong> Pick best image from batch."
    },
    {
        n: "Rebatch Latents",
        id: "RebatchLatents", 
        t: "Latent",
        d: "Organizes groups.",
        u: "<strong>How to use:</strong> Split batch of 10 into 2 batches of 5."
    },
    {
        n: "Repeat Latent Batch",
        id: "RepeatLatentBatch", 
        t: "Latent",
        d: "Clones the latent.",
        u: "<strong>How to use:</strong> Generate 1 latent, repeat 4 times."
    },
    {
        n: "Set Latent Noise Mask",
        id: "SetLatentNoiseMask", 
        t: "Latent",
        d: "Tells sampler where to add noise.",
        u: "<strong>How to use:</strong> Limit creativity to specific areas."
    },
    {
        n: "Crop Latent",
        id: "LatentCrop", 
        t: "Latent",
        d: "Crops the canvas.",
        u: "<strong>How to use:</strong> Crop to save VRAM."
    },
    {
        n: "Flip Latent",
        id: "LatentFlip", 
        t: "Latent",
        d: "Mirrors image horizontally/vertically.",
        u: "<strong>How to use:</strong> Faster than decoding to flip."
    },
    {
        n: "Rotate Latent",
        id: "LatentRotate", 
        t: "Latent",
        d: "Rotates 90 degrees.",
        u: "<strong>How to use:</strong> Change portrait to landscape."
    },
    {
        n: "Latent Batch Seed Behavior",
        id: "LatentBatchSeedBehavior", 
        t: "Latent",
        d: "Decides if images in batch get different seeds.",
        u: "<strong>How to use:</strong> Set to 'Fixed' for testing."
    },
    {
        n: "Empty Hunyuan Latent Video",
        id: "EmptyHunyuanLatentVideo", 
        t: "Latent",
        d: "Creates blank video container for Hunyuan.",
        u: "<strong>How to use:</strong> Sets width, height, frames."
    },

    // === IO / SAVE ===
    {
        n: "Save Image",
        id: "SaveImage",
        t: "IO",
        d: "Saves final result to hard drive.",
        u: "<strong>How to use:</strong> Connect to end. Images in 'ComfyUI/output'."
    },
    {
        n: "Preview Image",
        id: "PreviewImage",
        t: "IO",
        d: "Shows image in browser, does NOT save to disk.",
        u: "<strong>How to use:</strong> Use when testing to save space."
    },
    {
        n: "Load Image",
        id: "LoadImage",
        t: "IO",
        d: "Opens an image from your computer.",
        u: "<strong>How to use:</strong> Upload photo for Img2Img."
    },
    {
        n: "Checkpoint Save",
        id: "CheckpointSave", 
        t: "IO",
        d: "Saves a merged model file.",
        u: "<strong>How to use:</strong> Save merged models as .safetensors."
    },
    {
        n: "CLIP Save",
        id: "CLIPSave", 
        t: "IO",
        d: "Saves a CLIP model.",
        u: "<strong>How to use:</strong> Rarely used."
    },
    {
        n: "VAE Save",
        id: "VAESave", 
        t: "IO",
        d: "Saves a VAE.",
        u: "<strong>How to use:</strong> Save pixel translator."
    },
    {
        n: "Save Animated PNG",
        id: "SaveAnimatedPNG", 
        t: "IO",
        d: "Saves a video as a .png file.",
        u: "<strong>How to use:</strong> High quality loops."
    },
    {
        n: "Save Animated WEBP",
        id: "SaveAnimatedWEBP", 
        t: "IO",
        d: "Saves a video as .webp.",
        u: "<strong>How to use:</strong> Best format for web."
    },

    // === MODEL / MERGE ===
    {
        n: "CLIPMerge Simple",
        id: "CLIPMergeSimple", 
        t: "Model",
        d: "Mixes two Text Readers.",
        u: "<strong>How to use:</strong> Combine knowledge of two CLIP models."
    },
    {
        n: "Model Merge Simple",
        id: "ModelMergeSimple", 
        t: "Model",
        d: "Mixes two AI brains (Checkpoints).",
        u: "<strong>How to use:</strong> Ratio 0.5 = Even mix."
    },
    {
        n: "Model Merge Add",
        id: "ModelMergeAdd", 
        t: "Model",
        d: "Adds Model B to Model A.",
        u: "<strong>How to use:</strong> Can increase model intensity."
    },
    {
        n: "Model Merge Subtract",
        id: "ModelMergeSubtract", 
        t: "Model",
        d: "Subtracts Model B from Model A.",
        u: "<strong>How to use:</strong> Extract difference (create LoRA)."
    },
    {
        n: "Model Merge Blocks",
        id: "ModelMergeBlocks", 
        t: "Model",
        d: "Advanced Mixing. Choose which layers to mix.",
        u: "<strong>How to use:</strong> Keep lighting from A, texture from B."
    },

    // === UTILITY ===
    {
        n: "Note",
        id: "Note",
        t: "Utility",
        d: "A sticky note.",
        u: "<strong>How to use:</strong> Write reminders."
    },
    {
        n: "Primitive",
        id: "PrimitiveNode", 
        t: "Utility",
        d: "A wildcard node. Becomes whatever you connect it to.",
        u: "<strong>How to use:</strong> Connect to Seed/Steps."
    },
    {
        n: "Reroute",
        id: "Reroute",
        t: "Utility",
        d: "A wiring pin. Organizes cables.",
        u: "<strong>How to use:</strong> Make 90-degree turns."
    },
    {
        n: "Terminal Log (Manager)",
        id: "Cmder", 
        t: "Utility",
        d: "Shows system console inside browser.",
        u: "<strong>How to use:</strong> View errors."
    }
];

// === STYLES ===
const style = document.createElement("style");
style.textContent = `
    /* SLIDING RIGHT PANEL STYLES */
    #bible-panel {
        position: fixed;
        top: 0; 
        right: 0; 
        width: 450px; 
        max-width: 100vw; 
        height: 100vh;
        background: rgba(20, 20, 20, 0.98);
        border-left: 1px solid #444;
        box-shadow: -10px 0 30px rgba(0,0,0,0.8);
        z-index: 9999999;
        display: flex;
        flex-direction: column;
        backdrop-filter: blur(15px);
        font-family: 'Segoe UI', Roboto, sans-serif;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    #bible-panel.visible { 
        transform: translateX(0); 
    }
    
    .bible-header {
        background: #1a1a1a; 
        padding: 20px 20px 15px 20px; 
        display: flex;
        flex-direction: column; 
        align-items: center; 
        border-bottom: 1px solid #333; 
        position: relative;
    }
    
    /* UPDATED CLOSE BUTTON STYLES */
    .bible-close {
        position: absolute; 
        top: 15px; 
        right: 20px;
        background: transparent; 
        color: #888; 
        border: none; 
        padding: 5px;
        font-size: 1.5rem; 
        cursor: pointer; 
        line-height: 1; 
        transition: 0.2s;
    }
    .bible-close:hover { 
        color: #e74c3c; 
        transform: scale(1.1); 
    }

    .bible-search {
        width: 100%; padding: 10px; border-radius: 6px;
        border: 1px solid #444; background: #0d0d0d; color: white; font-size: 1rem; margin-bottom: 15px;
    }
    .bible-cats { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
    .bible-cat-btn {
        background: #2a2a2a; color: #ccc; border: 1px solid #3a3a3a;
        padding: 4px 10px; border-radius: 12px; cursor: pointer; font-size: 0.8rem;
    }
    .bible-cat-btn:hover { background: #444; color: white; }
    .bible-cat-btn.active { background: #7c4dff; color: white; border-color: #7c4dff; }

    .bible-content { flex: 1; overflow-y: auto; padding: 20px; }
    
    /* SINGLE COLUMN FOR SIDE PANEL */
    .bible-grid {
        display: flex; 
        flex-direction: column; 
        gap: 15px;
    }

    .bible-card {
        background: #1e1e1e; border-radius: 8px; border-left: 5px solid #666;
        display: flex; flex-direction: column; overflow: hidden;
        transition: transform 0.2s; 
        cursor: grab; /* Indicates Draggable */
        position: relative;
    }
    .bible-card:active { cursor: grabbing; } /* Grabbing when held */
    .bible-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
    .bible-card-header {
        padding: 10px 15px; background: rgba(255,255,255,0.05); display: flex; justify-content: space-between;
        font-weight: bold; color: #fff; align-items: center;
    }
    .bible-card-body { padding: 15px; color: #b0b0b0; font-size: 0.9rem; flex: 1; display: flex; flex-direction: column; gap: 10px;}
    .bible-usage {
        margin-top: auto; padding: 10px; background: #141414; border-radius: 6px; border-left: 2px solid #7c4dff;
    }

    /* === THE EPIC BIBLE BUTTON STYLES === */
    .epic-bible-btn {
        background: linear-gradient(135deg, #6a1b9a 0%, #8e44ad 100%) !important;
        color: #f1c40f !important; /* Gold text */
        border: 1px solid #f39c12 !important; /* Gold border */
        box-shadow: 0 0 10px rgba(142, 68, 173, 0.6), inset 0 0 5px rgba(241, 196, 18, 0.2) !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        transition: all 0.2s ease !important;
        margin-right: 8px !important;
        border-radius: 6px !important;
    }

    .epic-bible-btn:hover {
        background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%) !important;
        box-shadow: 0 0 15px rgba(142, 68, 173, 0.9), 0 0 8px rgba(241, 196, 18, 0.6) !important;
        transform: translateY(-1px) !important;
    }

    .epic-bible-btn i {
        color: #f1c40f !important; /* Force the icon to be gold too */
        text-shadow: 0 0 5px rgba(241, 196, 18, 0.5) !important;
    }

    /* === PREVIEW POPUP === */
    #bible-preview {
        position: fixed;
        background: #222;
        border: 1px solid #555;
        border-radius: 8px;
        padding: 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        z-index: 9999999;
        display: none;
        pointer-events: none; /* Let mouse pass through */
        width: 250px;
        font-size: 12px;
        color: #eee;
        overflow: hidden;
    }
    .bp-header { background: #333; padding: 8px; font-weight: bold; text-align: center; border-bottom: 1px solid #444; }
    .bp-body { display: flex; justify-content: space-between; padding: 10px; background: #2a2a2a; }
    .bp-col { display: flex; flex-direction: column; gap: 8px; }
    .bp-col-right { text-align: right; }
    .bp-socket { display: flex; align-items: center; gap: 6px; }
    .bp-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    
    /* Socket Colors */
    .sk-MODEL { background: #6652a6; } 
    .sk-CLIP { background: #e0d84a; } 
    .sk-VAE { background: #a63931; } 
    .sk-IMAGE { background: #5b92cf; } 
    .sk-LATENT { background: #c26369; } 
    .sk-CONDITIONING { background: #c28834; } 
    .sk-INT, .sk-FLOAT, .sk-number { background: #27ae60; } 
    .sk-STRING { background: #7f8c8d; } 
    .sk-MASK { background: #16a085; } 
    .sk-UNKNOWN { background: #777; }

    .t-Loader { border-left-color: #8e44ad; }
    .t-Conditioning { border-left-color: #d35400; }
    .t-Latent { border-left-color: #c0392b; }
    .t-Sampling { border-left-color: #27ae60; }
    .t-Image { border-left-color: #2980b9; }
    .t-Mask { border-left-color: #16a085; }
    .t-IO { border-left-color: #7f8c8d; }
    .t-Model { border-left-color: #f1c40f; }
`;
document.head.appendChild(style);

// HELPER: Toggle function checks current state and opens/closes appropriately
function toggleBiblePanel() {
    const panel = document.getElementById('bible-panel');
    if (panel) {
        toggleBible(!panel.classList.contains('visible'));
    }
}

// === APP EXTENSION ===
app.registerExtension({
    name: "Comfy.BeginnerBible",
    async setup() {
        console.log("📖 [Beginner Bible] setup() function is running! Initializing hotkey...");

        // HOTKEY: Alt + B
        window.addEventListener("keydown", (e) => {
            if (e.altKey && e.key.toLowerCase() === 'b') {
                toggleBiblePanel();
            }
        });

        // DRAG AND DROP: Global Listeners for canvas drops (Using CAPTURE phase to intercept LiteGraph)
        window.addEventListener("dragover", (e) => {
            // Check if our custom drag data is present
            if (e.dataTransfer.types.includes('bible/node-id')) {
                e.preventDefault(); // Required to allow dropping
                e.stopPropagation(); // Stop LiteGraph from trying to read it as a file
                e.dataTransfer.dropEffect = 'copy';
            }
        }, true); // <- The 'true' activates the capture phase

        window.addEventListener("drop", (e) => {
            if (e.dataTransfer.types.includes('bible/node-id')) {
                e.preventDefault();
                e.stopPropagation(); // Stop LiteGraph from throwing an unsupported file error
                const nodeId = e.dataTransfer.getData('bible/node-id');
                if (nodeId) {
                    addNodeToGraph(nodeId, e); // Pass the mouse event so we know EXACTLY where to drop it
                }
            }
        }, true); // <- The 'true' activates the capture phase

        // Initialize our UI elements immediately so they are ready
        createBibleInterface();
        createPreviewTooltip();

        let v2Success = false;

        // Try V2 Native Integration (Adds to top menu with an icon!)
        try {
            if (app.menu?.settingsGroup) {
                // Dynamically import the native ComfyUI V2 component system
                const { ComfyButtonGroup } = await import("../../scripts/ui/components/buttonGroup.js");
                const { ComfyButton } = await import("../../scripts/ui/components/button.js");

                let bibleBtn = new ComfyButton({
                    icon: "book", // Native Icon
                    action: toggleBiblePanel, 
                    tooltip: "Open Beginner Bible (Alt+B)",
                    content: "Bible",
                    classList: "comfyui-button comfyui-menu-mobile-collapse"
                });

                // Attach our epic CSS class securely to the button element
                bibleBtn.element.classList.add("epic-bible-btn");
                let bibleGroup = new ComfyButtonGroup(bibleBtn.element);

                // Inject it right before the settings gear, exactly like ComfyUI Manager!
                app.menu.settingsGroup.element.before(bibleGroup.element);
                v2Success = true;
                console.log("📖 [Beginner Bible] V2 Native button injected with styling!");
            }
        } catch (exception) {
            console.log("📖 [Beginner Bible] V2 Native integration skipped, falling back.");
        }

        // STICKY INJECTOR FALLBACK (If we are on V1 or V2 integration failed)
        if (!v2Success) {
            setInterval(ensureUIFallback, 2000);
            setTimeout(ensureUIFallback, 500);
        }
    }
});

// The heartbeat function for the fallback UI
function ensureUIFallback() {
    createBibleInterface();
    createPreviewTooltip();

    if (!document.getElementById("bible-floating-btn")) {
        console.log("📖 [Beginner Bible] Injecting fallback button...");
        
        const btn = document.createElement("button");
        btn.id = "bible-floating-btn";
        btn.textContent = "📖 Beginner Bible (Alt+B)";
        btn.className = "epic-bible-btn"; // Use the same epic styling!
        btn.style.zIndex = "9999999"; 
        btn.onclick = toggleBiblePanel;

        const menu = document.querySelector(".comfy-menu");
        if (menu) {
            // Classic UI
            btn.style.marginTop = "10px";
            btn.style.padding = "10px";
            btn.style.width = "100%";
            menu.appendChild(btn);
        } else {
            // V2 UI Fallback
            btn.style.position = "fixed";
            btn.style.bottom = "30px";
            btn.style.right = "30px";
            btn.style.padding = "12px 24px";
            document.body.appendChild(btn);
        }
    }
}

function createBibleInterface() {
    // CRUCIAL: Prevent making duplicates if it already exists
    if (document.getElementById('bible-panel')) return; 

    const root = document.createElement('div');
    root.id = 'bible-panel';
    root.innerHTML = `
        <div class="bible-header">
            <button class="bible-close" id="bible-close-btn" title="Close">✖</button>
            <h2 style="color:white; margin:0 0 10px 0; font-size: 1.4rem;">📖 Beginner Bible</h2>
            <input type="text" class="bible-search" placeholder="Search nodes..." id="bible-search">
            <div class="bible-cats" id="bible-cats"></div>
        </div>
        <div class="bible-content">
            <div class="bible-grid" id="bible-grid"></div>
        </div>
    `;
    document.body.appendChild(root);
    
    // Attach close event safely via JS
    document.getElementById('bible-close-btn').addEventListener('click', () => toggleBible(false));
    
    document.addEventListener('keydown', (e) => {
        if(e.key === "Escape") toggleBible(false);
    });
    
    initLogic();
}

function createPreviewTooltip() {
    // CRUCIAL: Prevent making duplicates if it already exists
    if (document.getElementById('bible-preview')) return;
    
    const el = document.createElement('div');
    el.id = 'bible-preview';
    document.body.appendChild(el);
}

function toggleBible(show) {
    const el = document.getElementById('bible-panel');
    if(show) {
        el.classList.add('visible');
        // Give the slide animation a moment to start before focusing input
        setTimeout(() => document.getElementById('bible-search').focus(), 300);
    } else {
        el.classList.remove('visible');
    }
}

// === LOGIC ===
let activeCat = 'All';
const categories = ['All', 'Loader', 'Conditioning', 'Sampling', 'Latent', 'Image', 'Mask', 'Model', 'IO', 'Utility'];

function initLogic() {
    const catContainer = document.getElementById('bible-cats');
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `bible-cat-btn ${cat === 'All' ? 'active' : ''}`;
        btn.textContent = cat;
        btn.onclick = () => {
            activeCat = cat;
            document.querySelectorAll('.bible-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderNodes(document.getElementById('bible-search').value);
        };
        catContainer.appendChild(btn);
    });
    document.getElementById('bible-search').addEventListener('input', (e) => renderNodes(e.target.value));
    renderNodes();
}

function renderNodes(filterText = '') {
    const grid = document.getElementById('bible-grid');
    grid.innerHTML = '';
    const sorted = nodes.sort((a, b) => a.n.localeCompare(b.n));

    sorted.forEach(node => {
        const matchesText = node.n.toLowerCase().includes(filterText.toLowerCase()) || 
                            node.d.toLowerCase().includes(filterText.toLowerCase());
        const matchesCat = activeCat === 'All' || node.t === activeCat;

        if (matchesText && matchesCat) {
            const card = document.createElement('div');
            card.className = `bible-card t-${node.t}`;
            card.draggable = true; // Enables HTML5 drag and drop natively
            
            // Re-worded the hint text to clarify they can click OR drag
            const idText = node.id 
                ? `<span style="color:#27ae60">ID: ${node.id} <span style="color:#aaa;">(Click or Drag)</span></span>` 
                : `<span style="color:#c0392b">ID Missing</span>`;

            card.innerHTML = `
                <div class="bible-card-header">
                    <span>${node.n}</span>
                    <small>${node.t}</small>
                </div>
                <div class="bible-card-body">
                    <div>${node.d}</div>
                    <div class="bible-usage">${node.u}</div>
                    <div style="font-size:0.75rem; background:rgba(0,0,0,0.2); padding:4px; border-radius:4px; margin-top:5px; text-align:center;">${idText}</div>
                </div>
            `;

            // === DRAG EVENTS ===
            card.addEventListener('dragstart', (e) => {
                if(!node.id) return;
                // Custom data type must be lowercase for some browsers
                e.dataTransfer.setData('bible/node-id', node.id);
                e.dataTransfer.effectAllowed = 'copy';
                hidePreview(); // Stop the hover preview from getting in the way of your drag
            });

            // === MOUSE EVENTS FOR PREVIEW ===
            card.addEventListener('mouseenter', (e) => showPreview(node.id, e));
            card.addEventListener('mouseleave', () => hidePreview());
            card.addEventListener('mousemove', (e) => movePreview(e));

            // === CLICK TO ADD (Still supported as an alternative to dragging) ===
            card.onclick = () => {
                if(!node.id || node.id === "") {
                    alert(`ID Missing! needs to add the internal ID for "${node.n}".`);
                    return;
                }
                addNodeToGraph(node.id);
            };
            grid.appendChild(card);
        }
    });
}

// === PREVIEW SYSTEM (The Fake Node Generator) ===
function showPreview(nodeId, e) {
    if (!nodeId || !LiteGraph.registered_node_types[nodeId]) return;

    const preview = document.getElementById('bible-preview');
    
    // Create a dummy node to inspect its inputs/outputs
    // We try/catch because sometimes creating a node without a graph can fail
    try {
        const tempNode = LiteGraph.createNode(nodeId);
        
        // Build the HTML
        let inputsHtml = "";
        let outputsHtml = "";

        if (tempNode.inputs) {
            tempNode.inputs.forEach(inp => {
                const typeClass = `sk-${inp.type}`;
                inputsHtml += `<div class="bp-socket"><span class="bp-dot ${typeClass}"></span> ${inp.name}</div>`;
            });
        }

        if (tempNode.outputs) {
            tempNode.outputs.forEach(out => {
                const typeClass = `sk-${out.type}`;
                outputsHtml += `<div class="bp-socket" style="flex-direction:row-reverse; text-align:right;">
                                <span class="bp-dot ${typeClass}"></span> ${out.name}</div>`;
            });
        }

        preview.innerHTML = `
            <div class="bp-header">${tempNode.title || tempNode.type}</div>
            <div class="bp-body">
                <div class="bp-col">${inputsHtml || '<span style="color:#555">No Inputs</span>'}</div>
                <div class="bp-col bp-col-right">${outputsHtml || '<span style="color:#555">No Outputs</span>'}</div>
            </div>
        `;
        
        preview.style.display = 'block';
        movePreview(e);
        
    } catch (err) {
        console.error("Preview failed:", err);
    }
}

function hidePreview() {
    document.getElementById('bible-preview').style.display = 'none';
}

function movePreview(e) {
    const preview = document.getElementById('bible-preview');
    // Position it to the right of the mouse
    const x = e.clientX + 20;
    const y = e.clientY + 20;
    
    // Prevent going off screen (This will automatically pop the preview to the left of your cursor since it's a sidebar now!)
    const rect = preview.getBoundingClientRect();
    const safeX = (x + rect.width > window.innerWidth) ? (e.clientX - rect.width - 20) : x;
    const safeY = (y + rect.height > window.innerHeight) ? (e.clientY - rect.height - 20) : y;

    preview.style.left = safeX + 'px';
    preview.style.top = safeY + 'px';
}

// Updated to accurately calculate coordinates in LiteGraph based on zoom and pan
function addNodeToGraph(type, dropEvent = null) {
    if(!(type in LiteGraph.registered_node_types)) {
        alert(`Error: Node type '${type}' not found.`);
        return;
    }
    var node = LiteGraph.createNode(type);
    
    if (dropEvent && app.canvas?.canvas) {
        // Calculate precise drop coordinates inside the LiteGraph canvas
        const rect = app.canvas.canvas.getBoundingClientRect();
        const x = dropEvent.clientX - rect.left;
        const y = dropEvent.clientY - rect.top;
        
        // Convert DOM coordinates to Graph coordinates (accounting for zoom/pan)
        node.pos = [
            (x - app.canvas.ds.offset[0]) / app.canvas.ds.scale,
            (y - app.canvas.ds.offset[1]) / app.canvas.ds.scale
        ];
    } else if (app.canvas) {
        // If clicked, default to the center of the current screen view
        node.pos = [
            (-app.canvas.ds.offset[0] + app.canvas.canvas.width / 2) / app.canvas.ds.scale,
            (-app.canvas.ds.offset[1] + app.canvas.canvas.height / 2) / app.canvas.ds.scale
        ];
    }
    
    app.graph.add(node);
    app.canvas.selectNode(node);

}
