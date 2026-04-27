# API Reference

## Overview

The OG Image Generation Service provides RESTful endpoints for generating dynamic Open Graph images with customizable themes and content.

## Base URL

```
https://your-domain.com
```

## Endpoints

### Generate OG Image

#### GET `/`

Generates an OG image using query parameters.

**Query Parameters:**

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| `title` | string | Yes | The title text for the OG image | Max 100 characters, non-empty |
| `description` | string | Yes | The description text for the OG image | Max 200 characters, non-empty |
| `theme` | string | No | Theme name for styling | One of: `gradient`, `minimal`, `spotlight`, `editorial`, `system` (default: `gradient`) |

**Example Request:**
```
GET /?title=Hello%20World&description=This%20is%20a%20sample%20OG%20image&theme=spotlight
```

**Response:**
- **Content-Type:** `image/png`
- **Cache-Control:** `public, max-age=0, s-maxage=86400`
- **ETag:** Generated hash for cache validation
- **X-OG-Theme:** The theme used for generation

#### POST `/`

Generates an OG image using JSON request body.

**Headers:**
- `Content-Type: application/json` (required)

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "theme": "string" // optional
}
```

**Field Validation:**
- `title`: Required, max 100 characters, non-empty string
- `description`: Required, max 200 characters, non-empty string
- `theme`: Optional, must be one of the supported themes

**Example Request:**
```bash
curl -X POST https://your-domain.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello World",
    "description": "This is a sample OG image",
    "theme": "minimal"
  }'
```

**Response:**
Same as GET endpoint with appropriate headers and PNG image data.

### Health Check

#### GET `/health`

Returns the health status of the service.

**Response:**
```json
{
  "status": "healthy",
  "service": "og-image",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "0.1.0"
}
```

#### HEAD `/health`

Health check without response body.

**Response:**
- **Status:** `200 OK`
- **Body:** Empty

## Error Responses

All endpoints return consistent error responses in JSON format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "success": false
}
```

### Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| `400` | `VALIDATION_ERROR` | Invalid input parameters |
| `415` | `UNSUPPORTED_MEDIA_TYPE` | Content-Type must be application/json |
| `500` | `GENERATION_ERROR` | Failed to generate the image |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

### Common Error Scenarios

**Missing Required Fields:**
```json
{
  "error": "Title is required",
  "code": "VALIDATION_ERROR",
  "success": false
}
```

**Invalid Theme:**
```json
{
  "error": "Theme must be one of: gradient, minimal, spotlight, editorial, system",
  "code": "VALIDATION_ERROR",
  "success": false
}
```

**Character Limit Exceeded:**
```json
{
  "error": "Title must be less than or equal to 100 characters",
  "code": "VALIDATION_ERROR",
  "success": false
}
```

## Themes

The service supports 5 predefined themes:

### 1. Gradient (Default)
- Modern gradient background
- Clean typography
- Suitable for general use

### 2. Minimal
- Simple, clean design
- Minimal color palette
- Focus on typography

### 3. Spotlight
- Dramatic lighting effects
- High contrast
- Eye-catching design

### 4. Editorial
- Magazine-style layout
- Professional appearance
- Good for content sites

### 5. System
- System-inspired design
- Monospace elements
- Technical aesthetic

## Caching

The service implements intelligent caching:

- **ETag Header:** Generated based on content and options
- **Cache-Control:** `public, max-age=0, s-maxage=86400`
- **Vary Header:** Responds to Origin for CORS
- **Conditional Requests:** Supports If-None-Match for cache validation

## Security

### CORS Configuration

Allowed origins:
- `http://localhost:3000`
- `http://localhost:3001`
- Any `https://*.vercel.app` domain

### Security Headers

- `Referrer-Policy: no-referrer`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`

## Rate Limiting

Currently no rate limiting is implemented, but consider implementing for production use.

## SDK Examples

### JavaScript/TypeScript

```typescript
// Using fetch API
async function generateOGImage(title: string, description: string, theme?: string) {
  const response = await fetch('https://your-domain.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, theme }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return response.blob(); // PNG image data
}

// Usage
const imageBlob = await generateOGImage(
  'Hello World',
  'This is a sample OG image',
  'minimal'
);
```

### cURL

```bash
# GET request
curl "https://your-domain.com/?title=Hello%20World&description=Sample%20description&theme=gradient" \
  --output og-image.png

# POST request
curl -X POST https://your-domain.com/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello World","description":"Sample description","theme":"gradient"}' \
  --output og-image.png
```

### Python

```python
import requests

def generate_og_image(title: str, description: str, theme: str = "gradient"):
    url = "https://your-domain.com/"
    data = {"title": title, "description": description, "theme": theme}
    
    response = requests.post(url, json=data)
    response.raise_for_status()
    
    return response.content  # PNG image data

# Usage
image_data = generate_og_image("Hello World", "Sample description", "minimal")
with open("og-image.png", "wb") as f:
    f.write(image_data)
```

## Image Specifications

- **Format:** PNG
- **Default Dimensions:** 1200x628 pixels (standard OG size)
- **Fonts:** Figtree (regular, semibold), Geist Mono (regular, semibold)
- **Color Space:** RGB
- **Compression:** Optimized for web

## Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_ENV` | string | `development` | Environment mode |
| `OG_HTML_DEBUG` | string | `undefined` | Set to "1" for HTML debugging |