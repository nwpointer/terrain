precision mediump float;
varying vec2 _uv;

uniform sampler2D uColor;
uniform sampler2D uNoise;

uniform sampler2D uSplat1;
uniform sampler2D uSplat2;
uniform sampler2D uSplat3;
uniform sampler2D uSplat4;
uniform sampler2D uSplat5;
uniform sampler2D uSplat6;

uniform sampler2D uDiffuse1;
uniform sampler2D uDiffuse2;
uniform sampler2D uDiffuse3;
uniform sampler2D uDiffuse4;
uniform sampler2D uDiffuse5;
uniform sampler2D uDiffuse6;

uniform vec2 uDiffuseRepeat1;
uniform vec2 uDiffuseRepeat2;
uniform vec2 uDiffuseRepeat3;
uniform vec2 uDiffuseRepeat4;
uniform vec2 uDiffuseRepeat5;
uniform vec2 uDiffuseRepeat6;

// vec4 texture_UV(sampler2D tex, vec3 x) {
//     float k = texture(uNoise, 0.0025*x.xy).x; // cheap (cache friendly) lookup

//     vec2 duvdx = dFdx( x.xy );
//     vec2 duvdy = dFdx( x.xy );

//     float l = k*8.0;
//     float f = fract(l);

//     float ia = floor(l+0.5); // suslik's method (see comments)
//     float ib = floor(l);
//     f = min(f, 1.0-f)*2.0;
//     vec2 offa = sin(vec2(3.0,7.0)*ia); // can replace with any other hash
//     vec2 offb = sin(vec2(3.0,7.0)*ib); // can replace with any other hash
//     vec4 cola = texture(tex, vec3(x.xy + offa, x.z).xy);
//     //   vec4 colb = texture(tex, vec3(x.xy + offb, x.z));
//     //   return mix(cola, colb, smoothstep(0.2,0.8,f-0.1*sum(cola.xyz-colb.xyz)));
//     return vec4(0,0,0,0);
// }

float sum( vec3 v ) { return v.x+v.y+v.z; }

vec4 textureNoTile(sampler2D tex, vec2 x, float v)
{
    // float v = 10.0; // controls strength of effect
    float k = texture( uNoise, 0.005*x ).x; // cheap (cache friendly) lookup
    
    vec2 duvdx = dFdx( x );
    vec2 duvdy = dFdx( x );
    
    float l = k*8.0;
    float f = fract(l);
    
    float ia = floor(l+0.5); // suslik's method (see comments)
    float ib = floor(l);
    f = min(f, 1.0-f)*2.0;
    
    vec2 offa = sin(vec2(3.0,7.0)*ia); // can replace with any other hash
    vec2 offb = sin(vec2(3.0,7.0)*ib); // can replace with any other hash

    vec3 cola = textureGrad( tex, x + v*offa, duvdx, duvdy ).xyz;
    vec3 colb = textureGrad( tex, x + v*offb, duvdx, duvdy ).xyz;
    
    vec3 col = mix( cola, colb, smoothstep(0.2,0.8,f-0.1*sum(cola-colb)) );
    return vec4(col,1.0);
}


void main()
{
    vec4 color = texture2D(uColor, _uv);
    vec4 diffuse1 = textureNoTile(uDiffuse1, _uv * uDiffuseRepeat1, 5.0);
    vec4 diffuse2 = textureNoTile(uDiffuse2, _uv * uDiffuseRepeat2, 5.0);
    vec4 diffuse3 = textureNoTile(uDiffuse3, _uv * uDiffuseRepeat3, 5.0);
    vec4 diffuse4 = textureNoTile(uDiffuse4, _uv * uDiffuseRepeat4, 5.0);
    vec4 diffuse5 = textureNoTile(uDiffuse5, _uv * uDiffuseRepeat5, 5.0);
    vec4 diffuse6 = textureNoTile(uDiffuse6, _uv * uDiffuseRepeat6, 5.0);
    vec4 splat1 = texture2D(uSplat1, _uv);
    vec4 splat2 = texture2D(uSplat2, _uv);
    vec4 splat3 = texture2D(uSplat3, _uv);
    vec4 splat4 = texture2D(uSplat4, _uv);
    vec4 splat5 = texture2D(uSplat5, _uv);
    vec4 splat6 = texture2D(uSplat6, _uv);

    gl_FragColor = 
        diffuse1 * splat1.r +
        diffuse2 * splat2.r +
        diffuse3 * splat3.r + 
        diffuse4 * splat4.r +
        diffuse5 * splat5.r + 
        diffuse6 * splat6.r;

    // gl_FragColor = 
    //     vec4(255.0,0.0,0.0,1.0) * splat1.r;

    // gl_FragColor = diffuse2;

    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}