declare namespace Components {
  namespace Schemas {
    /**
     * Body_segment_photo_background_and_foreground_segment_post
     */
    export interface BodySegmentPhotoBackgroundAndForegroundSegmentPost {
      /**
       * File
       */
      file: string // binary
    }
    /**
     * HTTPValidationError
     */
    export interface HTTPValidationError {
      /**
       * Detail
       */
      detail?: /* ValidationError */ ValidationError[]
    }
    /**
     * Segmentation
     */
    export interface Segmentation {
      /**
       * Foreground
       */
      foreground: string
      /**
       * Background
       */
      background: string
      /**
       * Source
       */
      source: string
      /**
       * Centerx
       */
      centerX: number
      /**
       * Centery
       */
      centerY: number
      /**
       * Width
       */
      width: number
      /**
       * Height
       */
      height: number
    }
    /**
     * ValidationError
     */
    export interface ValidationError {
      /**
       * Location
       */
      loc: (string | number)[]
      /**
       * Message
       */
      msg: string
      /**
       * Error Type
       */
      type: string
    }
  }
}
declare namespace Paths {
  namespace SegmentPhotoBackgroundAndForegroundSegmentPost {
    export type RequestBody =
      /* Body_segment_photo_background_and_foreground_segment_post */ Components.Schemas.BodySegmentPhotoBackgroundAndForegroundSegmentPost
    namespace Responses {
      export type $200 = /* Segmentation */ Components.Schemas.Segmentation
      export type $422 =
        /* HTTPValidationError */ Components.Schemas.HTTPValidationError
    }
  }
}
