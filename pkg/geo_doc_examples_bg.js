let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


function isLikeNone(x) {
    return x === undefined || x === null;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_1.set(idx, obj);
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedFloat32ArrayMemory0 = null;

function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedInt32ArrayMemory0 = null;

function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

export function main() {
    wasm.main();
}

export function init_vt_worker() {
    wasm.init_vt_worker();
}

/**
 * @param {any} msg
 * @returns {any}
 */
export function process_message(msg) {
    const ret = wasm.process_message(msg);
    return ret;
}

function __wbg_adapter_44(arg0, arg1, arg2) {
    wasm.closure499_externref_shim(arg0, arg1, arg2);
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_1.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
function __wbg_adapter_47(arg0, arg1) {
    const ret = wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h24d354f6c7342cfa_multivalue_shim(arg0, arg1);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function __wbg_adapter_52(arg0, arg1, arg2) {
    wasm.closure3097_externref_shim(arg0, arg1, arg2);
}

const __wbindgen_enum_GpuAddressMode = ["clamp-to-edge", "repeat", "mirror-repeat"];

const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha"];

const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];

const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];

const __wbindgen_enum_GpuCanvasAlphaMode = ["opaque", "premultiplied"];

const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];

const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];

const __wbindgen_enum_GpuFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuFrontFace = ["ccw", "cw"];

const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];

const __wbindgen_enum_GpuLoadOp = ["load", "clear"];

const __wbindgen_enum_GpuMipmapFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuPowerPreference = ["low-power", "high-performance"];

const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];

const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];

const __wbindgen_enum_GpuStencilOperation = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];

const __wbindgen_enum_GpuStorageTextureAccess = ["write-only", "read-only", "read-write"];

const __wbindgen_enum_GpuStoreOp = ["store", "discard"];

const __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];

const __wbindgen_enum_GpuTextureDimension = ["1d", "2d", "3d"];

const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];

const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];

const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];

const __wbindgen_enum_GpuVertexFormat = ["uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra"];

const __wbindgen_enum_GpuVertexStepMode = ["vertex", "instance"];

const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

const __wbindgen_enum_ResizeObserverBoxOptions = ["border-box", "content-box", "device-pixel-content-box"];

const TileIndexFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tileindex_free(ptr >>> 0, 1));
/**
 * Index of a tile.
 */
export class TileIndex {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TileIndexFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tileindex_free(ptr, 0);
    }
    /**
     * Z index.
     * @returns {number}
     */
    get z() {
        const ret = wasm.__wbg_get_tileindex_z(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Z index.
     * @param {number} arg0
     */
    set z(arg0) {
        wasm.__wbg_set_tileindex_z(this.__wbg_ptr, arg0);
    }
    /**
     * X index.
     * @returns {number}
     */
    get x() {
        const ret = wasm.__wbg_get_tileindex_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * X index.
     * @param {number} arg0
     */
    set x(arg0) {
        wasm.__wbg_set_tileindex_x(this.__wbg_ptr, arg0);
    }
    /**
     * Y index.
     * @returns {number}
     */
    get y() {
        const ret = wasm.__wbg_get_tileindex_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * Y index.
     * @param {number} arg0
     */
    set y(arg0) {
        wasm.__wbg_set_tileindex_y(this.__wbg_ptr, arg0);
    }
}

export function __wbg_Window_012086356a161dce(arg0) {
    const ret = arg0.Window;
    return ret;
};

export function __wbg_WorkerGlobalScope_dbe19b83176b742b(arg0) {
    const ret = arg0.WorkerGlobalScope;
    return ret;
};

export function __wbg_activeElement_367599fdfa7ad115(arg0) {
    const ret = arg0.activeElement;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_activeElement_7cabba30de7b6b67(arg0) {
    const ret = arg0.activeElement;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_activeTexture_0f19d8acfa0a14c2(arg0, arg1) {
    arg0.activeTexture(arg1 >>> 0);
};

export function __wbg_activeTexture_460f2e367e813fb0(arg0, arg1) {
    arg0.activeTexture(arg1 >>> 0);
};

export function __wbg_addEventListener_84ae3eac6e15480a() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4);
}, arguments) };

export function __wbg_altKey_c33c03aed82e4275(arg0) {
    const ret = arg0.altKey;
    return ret;
};

export function __wbg_altKey_d7495666df921121(arg0) {
    const ret = arg0.altKey;
    return ret;
};

export function __wbg_appendChild_8204974b7328bf98() { return handleError(function (arg0, arg1) {
    const ret = arg0.appendChild(arg1);
    return ret;
}, arguments) };

export function __wbg_arrayBuffer_d1b44c4390db422f() { return handleError(function (arg0) {
    const ret = arg0.arrayBuffer();
    return ret;
}, arguments) };

export function __wbg_arrayBuffer_f18c144cd0125f07(arg0) {
    const ret = arg0.arrayBuffer();
    return ret;
};

export function __wbg_at_7d852dd9f194d43e(arg0, arg1) {
    const ret = arg0.at(arg1);
    return ret;
};

export function __wbg_attachShader_3d4eb6af9e3e7bd1(arg0, arg1, arg2) {
    arg0.attachShader(arg1, arg2);
};

export function __wbg_attachShader_94e758c8b5283eb2(arg0, arg1, arg2) {
    arg0.attachShader(arg1, arg2);
};

export function __wbg_beginQuery_6af0b28414b16c07(arg0, arg1, arg2) {
    arg0.beginQuery(arg1 >>> 0, arg2);
};

export function __wbg_beginRenderPass_350345dc19419939() { return handleError(function (arg0, arg1) {
    const ret = arg0.beginRenderPass(arg1);
    return ret;
}, arguments) };

export function __wbg_bindAttribLocation_40da4b3e84cc7bd5(arg0, arg1, arg2, arg3, arg4) {
    arg0.bindAttribLocation(arg1, arg2 >>> 0, getStringFromWasm0(arg3, arg4));
};

export function __wbg_bindAttribLocation_ce2730e29976d230(arg0, arg1, arg2, arg3, arg4) {
    arg0.bindAttribLocation(arg1, arg2 >>> 0, getStringFromWasm0(arg3, arg4));
};

export function __wbg_bindBufferRange_454f90f2b1781982(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.bindBufferRange(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
};

export function __wbg_bindBuffer_309c9a6c21826cf5(arg0, arg1, arg2) {
    arg0.bindBuffer(arg1 >>> 0, arg2);
};

export function __wbg_bindBuffer_f32f587f1c2962a7(arg0, arg1, arg2) {
    arg0.bindBuffer(arg1 >>> 0, arg2);
};

export function __wbg_bindFramebuffer_bd02c8cc707d670f(arg0, arg1, arg2) {
    arg0.bindFramebuffer(arg1 >>> 0, arg2);
};

export function __wbg_bindFramebuffer_e48e83c0f973944d(arg0, arg1, arg2) {
    arg0.bindFramebuffer(arg1 >>> 0, arg2);
};

export function __wbg_bindRenderbuffer_53eedd88e52b4cb5(arg0, arg1, arg2) {
    arg0.bindRenderbuffer(arg1 >>> 0, arg2);
};

export function __wbg_bindRenderbuffer_55e205fecfddbb8c(arg0, arg1, arg2) {
    arg0.bindRenderbuffer(arg1 >>> 0, arg2);
};

export function __wbg_bindSampler_9f59cf2eaa22eee0(arg0, arg1, arg2) {
    arg0.bindSampler(arg1 >>> 0, arg2);
};

export function __wbg_bindTexture_a6e795697f49ebd1(arg0, arg1, arg2) {
    arg0.bindTexture(arg1 >>> 0, arg2);
};

export function __wbg_bindTexture_bc8eb316247f739d(arg0, arg1, arg2) {
    arg0.bindTexture(arg1 >>> 0, arg2);
};

export function __wbg_bindVertexArrayOES_da8e7059b789629e(arg0, arg1) {
    arg0.bindVertexArrayOES(arg1);
};

export function __wbg_bindVertexArray_6b4b88581064b71f(arg0, arg1) {
    arg0.bindVertexArray(arg1);
};

export function __wbg_blendColor_15ba1eff44560932(arg0, arg1, arg2, arg3, arg4) {
    arg0.blendColor(arg1, arg2, arg3, arg4);
};

export function __wbg_blendColor_6446fba673f64ff0(arg0, arg1, arg2, arg3, arg4) {
    arg0.blendColor(arg1, arg2, arg3, arg4);
};

export function __wbg_blendEquationSeparate_c1aa26a9a5c5267e(arg0, arg1, arg2) {
    arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_blendEquationSeparate_f3d422e981d86339(arg0, arg1, arg2) {
    arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_blendEquation_c23d111ad6d268ff(arg0, arg1) {
    arg0.blendEquation(arg1 >>> 0);
};

export function __wbg_blendEquation_cec7bc41f3e5704c(arg0, arg1) {
    arg0.blendEquation(arg1 >>> 0);
};

export function __wbg_blendFuncSeparate_483be8d4dd635340(arg0, arg1, arg2, arg3, arg4) {
    arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_blendFuncSeparate_dafeabfc1680b2ee(arg0, arg1, arg2, arg3, arg4) {
    arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_blendFunc_9454884a3cfd2911(arg0, arg1, arg2) {
    arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_blendFunc_c3b74be5a39c665f(arg0, arg1, arg2) {
    arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_blitFramebuffer_7303bdff77cfe967(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    arg0.blitFramebuffer(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0);
};

export function __wbg_blockSize_1490803190b57a34(arg0) {
    const ret = arg0.blockSize;
    return ret;
};

export function __wbg_blur_c2ad8cc71bac3974() { return handleError(function (arg0) {
    arg0.blur();
}, arguments) };

export function __wbg_body_942ea927546a04ba(arg0) {
    const ret = arg0.body;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_bottom_79b03e9c3d6f4e1e(arg0) {
    const ret = arg0.bottom;
    return ret;
};

export function __wbg_bufferData_3261d3e1dd6fc903(arg0, arg1, arg2, arg3) {
    arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
};

export function __wbg_bufferData_33c59bf909ea6fd3(arg0, arg1, arg2, arg3) {
    arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
};

export function __wbg_bufferData_463178757784fcac(arg0, arg1, arg2, arg3) {
    arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
};

export function __wbg_bufferData_d99b6b4eb5283f20(arg0, arg1, arg2, arg3) {
    arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
};

export function __wbg_bufferSubData_4e973eefe9236d04(arg0, arg1, arg2, arg3) {
    arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
};

export function __wbg_bufferSubData_dcd4d16031a60345(arg0, arg1, arg2, arg3) {
    arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
};

export function __wbg_buffer_09165b52af8c5237(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_buffer_609cc3eee51ed158(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_button_f75c56aec440ea04(arg0) {
    const ret = arg0.button;
    return ret;
};

export function __wbg_call_672a4d21634d4a24() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_call_7cccdd69e0791ae2() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_cancelAnimationFrame_089b48301c362fde() { return handleError(function (arg0, arg1) {
    arg0.cancelAnimationFrame(arg1);
}, arguments) };

export function __wbg_changedTouches_3654bea4294f2e86(arg0) {
    const ret = arg0.changedTouches;
    return ret;
};

export function __wbg_clearBufferfv_65ea413f7f2554a2(arg0, arg1, arg2, arg3, arg4) {
    arg0.clearBufferfv(arg1 >>> 0, arg2, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_clearBufferiv_c003c27b77a0245b(arg0, arg1, arg2, arg3, arg4) {
    arg0.clearBufferiv(arg1 >>> 0, arg2, getArrayI32FromWasm0(arg3, arg4));
};

export function __wbg_clearBufferuiv_8c285072f2026a37(arg0, arg1, arg2, arg3, arg4) {
    arg0.clearBufferuiv(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4));
};

export function __wbg_clearDepth_17cfee5be8476fae(arg0, arg1) {
    arg0.clearDepth(arg1);
};

export function __wbg_clearDepth_670d19914a501259(arg0, arg1) {
    arg0.clearDepth(arg1);
};

export function __wbg_clearInterval_ad2594253cc39c4b(arg0, arg1) {
    arg0.clearInterval(arg1);
};

export function __wbg_clearStencil_4323424f1acca0df(arg0, arg1) {
    arg0.clearStencil(arg1);
};

export function __wbg_clearStencil_7addd3b330b56b27(arg0, arg1) {
    arg0.clearStencil(arg1);
};

export function __wbg_clear_62b9037b892f6988(arg0, arg1) {
    arg0.clear(arg1 >>> 0);
};

export function __wbg_clear_f8d5f3c348d37d95(arg0, arg1) {
    arg0.clear(arg1 >>> 0);
};

export function __wbg_clientWaitSync_6930890a42bd44c0(arg0, arg1, arg2, arg3) {
    const ret = arg0.clientWaitSync(arg1, arg2 >>> 0, arg3 >>> 0);
    return ret;
};

export function __wbg_clientX_5eb380a5f1fec6fd(arg0) {
    const ret = arg0.clientX;
    return ret;
};

export function __wbg_clientX_687c1a16e03e1f58(arg0) {
    const ret = arg0.clientX;
    return ret;
};

export function __wbg_clientY_78d0605ac74642c2(arg0) {
    const ret = arg0.clientY;
    return ret;
};

export function __wbg_clientY_d8b9c7f0c4e2e677(arg0) {
    const ret = arg0.clientY;
    return ret;
};

export function __wbg_clipboardData_04bd9c1b0935d7e6(arg0) {
    const ret = arg0.clipboardData;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_clipboard_93f8aa8cc426db44(arg0) {
    const ret = arg0.clipboard;
    return ret;
};

export function __wbg_colorMask_5e7c60b9c7a57a2e(arg0, arg1, arg2, arg3, arg4) {
    arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
};

export function __wbg_colorMask_6dac12039c7145ae(arg0, arg1, arg2, arg3, arg4) {
    arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
};

export function __wbg_compileShader_0ad770bbdbb9de21(arg0, arg1) {
    arg0.compileShader(arg1);
};

export function __wbg_compileShader_2307c9d370717dd5(arg0, arg1) {
    arg0.compileShader(arg1);
};

export function __wbg_compressedTexSubImage2D_71877eec950ca069(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8, arg9);
};

export function __wbg_compressedTexSubImage2D_99abf4cfdb7c3fd8(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
};

export function __wbg_compressedTexSubImage2D_d66dcfcb2422e703(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
};

export function __wbg_compressedTexSubImage3D_58506392da46b927(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10);
};

export function __wbg_compressedTexSubImage3D_81477746675a4017(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10, arg11);
};

export function __wbg_configure_3303e55e07ebd920() { return handleError(function (arg0, arg1) {
    arg0.configure(arg1);
}, arguments) };

export function __wbg_contentBoxSize_638692469db816f2(arg0) {
    const ret = arg0.contentBoxSize;
    return ret;
};

export function __wbg_contentRect_81407eb60e52248f(arg0) {
    const ret = arg0.contentRect;
    return ret;
};

export function __wbg_copyBufferSubData_9469a965478e33b5(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.copyBufferSubData(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
};

export function __wbg_copyExternalImageToTexture_7c860a6f9d3d8b4e() { return handleError(function (arg0, arg1, arg2, arg3) {
    arg0.copyExternalImageToTexture(arg1, arg2, arg3);
}, arguments) };

export function __wbg_copyTexSubImage2D_05e7e8df6814a705(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
};

export function __wbg_copyTexSubImage2D_607ad28606952982(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
};

export function __wbg_copyTexSubImage3D_32e92c94044e58ca(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.copyTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
};

export function __wbg_copyTextureToBuffer_569bd20852d0378a() { return handleError(function (arg0, arg1, arg2, arg3) {
    arg0.copyTextureToBuffer(arg1, arg2, arg3);
}, arguments) };

export function __wbg_createBindGroupLayout_ccaa5d2aa2a2ae17() { return handleError(function (arg0, arg1) {
    const ret = arg0.createBindGroupLayout(arg1);
    return ret;
}, arguments) };

export function __wbg_createBindGroup_799a4c63deccf40c(arg0, arg1) {
    const ret = arg0.createBindGroup(arg1);
    return ret;
};

export function __wbg_createBuffer_7a9ec3d654073660(arg0) {
    const ret = arg0.createBuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createBuffer_9886e84a67b68c89(arg0) {
    const ret = arg0.createBuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createBuffer_a19c4c09aa7e61c6() { return handleError(function (arg0, arg1) {
    const ret = arg0.createBuffer(arg1);
    return ret;
}, arguments) };

export function __wbg_createCommandEncoder_3c9ad92fb9f1235d(arg0, arg1) {
    const ret = arg0.createCommandEncoder(arg1);
    return ret;
};

export function __wbg_createElement_8c9931a732ee2fea() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_createFramebuffer_7824f69bba778885(arg0) {
    const ret = arg0.createFramebuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createFramebuffer_c8d70ebc4858051e(arg0) {
    const ret = arg0.createFramebuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createImageBitmap_b814e27800576bdb() { return handleError(function (arg0, arg1) {
    const ret = arg0.createImageBitmap(arg1);
    return ret;
}, arguments) };

export function __wbg_createPipelineLayout_0718a3eb9884dcfb(arg0, arg1) {
    const ret = arg0.createPipelineLayout(arg1);
    return ret;
};

export function __wbg_createProgram_8ff56c485f3233d0(arg0) {
    const ret = arg0.createProgram();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createProgram_da203074cafb1038(arg0) {
    const ret = arg0.createProgram();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createQuery_5ed5e770ec1009c1(arg0) {
    const ret = arg0.createQuery();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createRenderPipeline_4429522c4a8eaaf8() { return handleError(function (arg0, arg1) {
    const ret = arg0.createRenderPipeline(arg1);
    return ret;
}, arguments) };

export function __wbg_createRenderbuffer_d88aa9403faa38ea(arg0) {
    const ret = arg0.createRenderbuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createRenderbuffer_fd347ae14f262eaa(arg0) {
    const ret = arg0.createRenderbuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createSampler_8f8704d5382370c3(arg0, arg1) {
    const ret = arg0.createSampler(arg1);
    return ret;
};

export function __wbg_createSampler_f76e29d7522bec9e(arg0) {
    const ret = arg0.createSampler();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createShaderModule_9e08b1b6ae277929(arg0, arg1) {
    const ret = arg0.createShaderModule(arg1);
    return ret;
};

export function __wbg_createShader_4a256a8cc9c1ce4f(arg0, arg1) {
    const ret = arg0.createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createShader_983150fb1243ee56(arg0, arg1) {
    const ret = arg0.createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createTexture_96a508752fa02d41() { return handleError(function (arg0, arg1) {
    const ret = arg0.createTexture(arg1);
    return ret;
}, arguments) };

export function __wbg_createTexture_9c536c79b635fdef(arg0) {
    const ret = arg0.createTexture();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createTexture_bfaa54c0cd22e367(arg0) {
    const ret = arg0.createTexture();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createVertexArrayOES_991b44f100f93329(arg0) {
    const ret = arg0.createVertexArrayOES();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createVertexArray_e435029ae2660efd(arg0) {
    const ret = arg0.createVertexArray();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_createView_ec23a75a47cb07cf() { return handleError(function (arg0, arg1) {
    const ret = arg0.createView(arg1);
    return ret;
}, arguments) };

export function __wbg_crypto_574e78ad8b13b65f(arg0) {
    const ret = arg0.crypto;
    return ret;
};

export function __wbg_ctrlKey_1e826e468105ac11(arg0) {
    const ret = arg0.ctrlKey;
    return ret;
};

export function __wbg_ctrlKey_cdbe8154dfb00d1f(arg0) {
    const ret = arg0.ctrlKey;
    return ret;
};

export function __wbg_cullFace_187079e6e20a464d(arg0, arg1) {
    arg0.cullFace(arg1 >>> 0);
};

export function __wbg_cullFace_fbae6dd4d5e61ba4(arg0, arg1) {
    arg0.cullFace(arg1 >>> 0);
};

export function __wbg_dataTransfer_86283b0702a1aff1(arg0) {
    const ret = arg0.dataTransfer;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_data_e77bd5c125ecc8a8(arg0, arg1) {
    const ret = arg1.data;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_debug_3cb59063b29f58c1(arg0) {
    console.debug(arg0);
};

export function __wbg_debug_54de743626e56edc(arg0, arg1) {
    console.debug(getStringFromWasm0(arg0, arg1));
};

export function __wbg_deleteBuffer_7ed96e1bf7c02e87(arg0, arg1) {
    arg0.deleteBuffer(arg1);
};

export function __wbg_deleteBuffer_a7822433fc95dfb8(arg0, arg1) {
    arg0.deleteBuffer(arg1);
};

export function __wbg_deleteFramebuffer_66853fb7101488cb(arg0, arg1) {
    arg0.deleteFramebuffer(arg1);
};

export function __wbg_deleteFramebuffer_cd3285ee5a702a7a(arg0, arg1) {
    arg0.deleteFramebuffer(arg1);
};

export function __wbg_deleteProgram_3fa626bbc0001eb7(arg0, arg1) {
    arg0.deleteProgram(arg1);
};

export function __wbg_deleteProgram_71a133c6d053e272(arg0, arg1) {
    arg0.deleteProgram(arg1);
};

export function __wbg_deleteQuery_6a2b7cd30074b20b(arg0, arg1) {
    arg0.deleteQuery(arg1);
};

export function __wbg_deleteRenderbuffer_59f4369653485031(arg0, arg1) {
    arg0.deleteRenderbuffer(arg1);
};

export function __wbg_deleteRenderbuffer_8808192853211567(arg0, arg1) {
    arg0.deleteRenderbuffer(arg1);
};

export function __wbg_deleteSampler_7f02bb003ba547f0(arg0, arg1) {
    arg0.deleteSampler(arg1);
};

export function __wbg_deleteShader_8d42f169deda58ac(arg0, arg1) {
    arg0.deleteShader(arg1);
};

export function __wbg_deleteShader_c65a44796c5004d8(arg0, arg1) {
    arg0.deleteShader(arg1);
};

export function __wbg_deleteSync_5a3fbe5d6b742398(arg0, arg1) {
    arg0.deleteSync(arg1);
};

export function __wbg_deleteTexture_a30f5ca0163c4110(arg0, arg1) {
    arg0.deleteTexture(arg1);
};

export function __wbg_deleteTexture_bb82c9fec34372ba(arg0, arg1) {
    arg0.deleteTexture(arg1);
};

export function __wbg_deleteVertexArrayOES_1ee7a06a4b23ec8c(arg0, arg1) {
    arg0.deleteVertexArrayOES(arg1);
};

export function __wbg_deleteVertexArray_77fe73664a3332ae(arg0, arg1) {
    arg0.deleteVertexArray(arg1);
};

export function __wbg_deltaMode_9bfd9fe3f6b4b240(arg0) {
    const ret = arg0.deltaMode;
    return ret;
};

export function __wbg_deltaX_5c1121715746e4b7(arg0) {
    const ret = arg0.deltaX;
    return ret;
};

export function __wbg_deltaY_f9318542caea0c36(arg0) {
    const ret = arg0.deltaY;
    return ret;
};

export function __wbg_depthFunc_2906916f4536d5d7(arg0, arg1) {
    arg0.depthFunc(arg1 >>> 0);
};

export function __wbg_depthFunc_f34449ae87cc4e3e(arg0, arg1) {
    arg0.depthFunc(arg1 >>> 0);
};

export function __wbg_depthMask_5fe84e2801488eda(arg0, arg1) {
    arg0.depthMask(arg1 !== 0);
};

export function __wbg_depthMask_76688a8638b2f321(arg0, arg1) {
    arg0.depthMask(arg1 !== 0);
};

export function __wbg_depthRange_3cd6b4dc961d9116(arg0, arg1, arg2) {
    arg0.depthRange(arg1, arg2);
};

export function __wbg_depthRange_f9c084ff3d81fd7b(arg0, arg1, arg2) {
    arg0.depthRange(arg1, arg2);
};

export function __wbg_destroy_a56b34700019252a(arg0) {
    arg0.destroy();
};

export function __wbg_devicePixelContentBoxSize_a6de82cb30d70825(arg0) {
    const ret = arg0.devicePixelContentBoxSize;
    return ret;
};

export function __wbg_devicePixelRatio_68c391265f05d093(arg0) {
    const ret = arg0.devicePixelRatio;
    return ret;
};

export function __wbg_disableVertexAttribArray_452cc9815fced7e4(arg0, arg1) {
    arg0.disableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_disableVertexAttribArray_afd097fb465dc100(arg0, arg1) {
    arg0.disableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_disable_2702df5b5da5dd21(arg0, arg1) {
    arg0.disable(arg1 >>> 0);
};

export function __wbg_disable_8b53998501a7a85b(arg0, arg1) {
    arg0.disable(arg1 >>> 0);
};

export function __wbg_disconnect_ac3f4ba550970c76(arg0) {
    arg0.disconnect();
};

export function __wbg_document_d249400bd7bd996d(arg0) {
    const ret = arg0.document;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_drawArraysInstancedANGLE_342ee6b5236d9702(arg0, arg1, arg2, arg3, arg4) {
    arg0.drawArraysInstancedANGLE(arg1 >>> 0, arg2, arg3, arg4);
};

export function __wbg_drawArraysInstanced_622ea9f149b0b80c(arg0, arg1, arg2, arg3, arg4) {
    arg0.drawArraysInstanced(arg1 >>> 0, arg2, arg3, arg4);
};

export function __wbg_drawArrays_6acaa2669c105f3a(arg0, arg1, arg2, arg3) {
    arg0.drawArrays(arg1 >>> 0, arg2, arg3);
};

export function __wbg_drawArrays_6d29ea2ebc0c72a2(arg0, arg1, arg2, arg3) {
    arg0.drawArrays(arg1 >>> 0, arg2, arg3);
};

export function __wbg_drawBuffersWEBGL_9fdbdf3d4cbd3aae(arg0, arg1) {
    arg0.drawBuffersWEBGL(arg1);
};

export function __wbg_drawBuffers_e729b75c5a50d760(arg0, arg1) {
    arg0.drawBuffers(arg1);
};

export function __wbg_drawElementsInstancedANGLE_096b48ab8686c5cf(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.drawElementsInstancedANGLE(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_drawElementsInstanced_f874e87d0b4e95e9(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_drawIndexed_9819a9d979963e82(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
};

export function __wbg_draw_18df8f5726f3a31e(arg0, arg1, arg2, arg3, arg4) {
    arg0.draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_elementFromPoint_be6286b8ec1ae1a2(arg0, arg1, arg2) {
    const ret = arg0.elementFromPoint(arg1, arg2);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_elementFromPoint_e788840a5168e09e(arg0, arg1, arg2) {
    const ret = arg0.elementFromPoint(arg1, arg2);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_enableVertexAttribArray_607be07574298e5e(arg0, arg1) {
    arg0.enableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_enableVertexAttribArray_93c3d406a41ad6c7(arg0, arg1) {
    arg0.enableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_enable_51114837e05ee280(arg0, arg1) {
    arg0.enable(arg1 >>> 0);
};

export function __wbg_enable_d183fef39258803f(arg0, arg1) {
    arg0.enable(arg1 >>> 0);
};

export function __wbg_endQuery_17aac36532ca7d47(arg0, arg1) {
    arg0.endQuery(arg1 >>> 0);
};

export function __wbg_end_848b622b765e9035(arg0) {
    arg0.end();
};

export function __wbg_error_524f506f44df1645(arg0) {
    console.error(arg0);
};

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_error_bbc7e5d1a0911165(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_fenceSync_02d142d21e315da6(arg0, arg1, arg2) {
    const ret = arg0.fenceSync(arg1 >>> 0, arg2 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_fetch_509096533071c657(arg0, arg1) {
    const ret = arg0.fetch(arg1);
    return ret;
};

export function __wbg_fetch_b7bf320f681242d2(arg0, arg1) {
    const ret = arg0.fetch(arg1);
    return ret;
};

export function __wbg_files_5f07ac9b6f9116a7(arg0) {
    const ret = arg0.files;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_finish_0169ed1c762f9db3(arg0) {
    const ret = arg0.finish();
    return ret;
};

export function __wbg_finish_10ad953096805038(arg0, arg1) {
    const ret = arg0.finish(arg1);
    return ret;
};

export function __wbg_flush_4150080f65c49208(arg0) {
    arg0.flush();
};

export function __wbg_flush_987c35de09e06fd6(arg0) {
    arg0.flush();
};

export function __wbg_focus_7d08b55eba7b368d() { return handleError(function (arg0) {
    arg0.focus();
}, arguments) };

export function __wbg_force_6e5acfdea2af0a4f(arg0) {
    const ret = arg0.force;
    return ret;
};

export function __wbg_framebufferRenderbuffer_2fdd12e89ad81eb9(arg0, arg1, arg2, arg3, arg4) {
    arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
};

export function __wbg_framebufferRenderbuffer_8b88592753b54715(arg0, arg1, arg2, arg3, arg4) {
    arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
};

export function __wbg_framebufferTexture2D_81a565732bd5d8fe(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
};

export function __wbg_framebufferTexture2D_ed855d0b097c557a(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
};

export function __wbg_framebufferTextureLayer_5e6bd1b0cb45d815(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.framebufferTextureLayer(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
};

export function __wbg_framebufferTextureMultiviewOVR_e54f936c3cc382cb(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.framebufferTextureMultiviewOVR(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5, arg6);
};

export function __wbg_from_2a5d3e218e67aa85(arg0) {
    const ret = Array.from(arg0);
    return ret;
};

export function __wbg_frontFace_289c9d7a8569c4f2(arg0, arg1) {
    arg0.frontFace(arg1 >>> 0);
};

export function __wbg_frontFace_4d4936cfaeb8b7df(arg0, arg1) {
    arg0.frontFace(arg1 >>> 0);
};

export function __wbg_getBindGroupLayout_d4d7451cf9c71533(arg0, arg1) {
    const ret = arg0.getBindGroupLayout(arg1 >>> 0);
    return ret;
};

export function __wbg_getBoundingClientRect_9073b0ff7574d76b(arg0) {
    const ret = arg0.getBoundingClientRect();
    return ret;
};

export function __wbg_getBufferSubData_8ab2dcc5fcf5770f(arg0, arg1, arg2, arg3) {
    arg0.getBufferSubData(arg1 >>> 0, arg2, arg3);
};

export function __wbg_getComputedStyle_046dd6472f8e7f1d() { return handleError(function (arg0, arg1) {
    const ret = arg0.getComputedStyle(arg1);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getContext_3ae09aaa73194801() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2), arg3);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getContext_e9cf379449413580() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getContext_f65a0debd1e8f8e8() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getContext_fc19859df6331073() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2), arg3);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getCurrentTexture_73b03cee66d598a5() { return handleError(function (arg0) {
    const ret = arg0.getCurrentTexture();
    return ret;
}, arguments) };

export function __wbg_getData_84cc441a50843727() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg1.getData(getStringFromWasm0(arg2, arg3));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_getElementById_f827f0d6648718a8(arg0, arg1, arg2) {
    const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_getExtension_ff0fb1398bcf28c3() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getIndexedParameter_f9211edc36533919() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getIndexedParameter(arg1 >>> 0, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getItem_17f98dee3b43fa7e() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg1.getItem(getStringFromWasm0(arg2, arg3));
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_getMappedRange_6d2048e506f70687() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getMappedRange(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_getParameter_1f0887a2b88e6d19() { return handleError(function (arg0, arg1) {
    const ret = arg0.getParameter(arg1 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getParameter_e3429f024018310f() { return handleError(function (arg0, arg1) {
    const ret = arg0.getParameter(arg1 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getPreferredCanvasFormat_28fe2764bbb4d725(arg0) {
    const ret = arg0.getPreferredCanvasFormat();
    return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 96) - 1;
};

export function __wbg_getProgramInfoLog_631c180b1b21c8ed(arg0, arg1, arg2) {
    const ret = arg1.getProgramInfoLog(arg2);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_getProgramInfoLog_a998105a680059db(arg0, arg1, arg2) {
    const ret = arg1.getProgramInfoLog(arg2);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_getProgramParameter_0c411f0cd4185c5b(arg0, arg1, arg2) {
    const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
    return ret;
};

export function __wbg_getProgramParameter_360f95ff07ac068d(arg0, arg1, arg2) {
    const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
    return ret;
};

export function __wbg_getPropertyValue_e623c23a05dfb30c() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg1.getPropertyValue(getStringFromWasm0(arg2, arg3));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_getQueryParameter_8921497e1d1561c1(arg0, arg1, arg2) {
    const ret = arg0.getQueryParameter(arg1, arg2 >>> 0);
    return ret;
};

export function __wbg_getRandomValues_3c9c0d586e575a16() { return handleError(function (arg0, arg1) {
    globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
}, arguments) };

export function __wbg_getRandomValues_b8f5dbd5f3995a9e() { return handleError(function (arg0, arg1) {
    arg0.getRandomValues(arg1);
}, arguments) };

export function __wbg_getRootNode_f59bcfa355239af5(arg0) {
    const ret = arg0.getRootNode();
    return ret;
};

export function __wbg_getShaderInfoLog_7e7b38fb910ec534(arg0, arg1, arg2) {
    const ret = arg1.getShaderInfoLog(arg2);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_getShaderInfoLog_f59c3112acc6e039(arg0, arg1, arg2) {
    const ret = arg1.getShaderInfoLog(arg2);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_getShaderParameter_511b5f929074fa31(arg0, arg1, arg2) {
    const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
    return ret;
};

export function __wbg_getShaderParameter_6dbe0b8558dc41fd(arg0, arg1, arg2) {
    const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
    return ret;
};

export function __wbg_getSupportedExtensions_8c007dbb54905635(arg0) {
    const ret = arg0.getSupportedExtensions();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_getSupportedProfiles_10d2a4d32a128384(arg0) {
    const ret = arg0.getSupportedProfiles();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_getSyncParameter_7cb8461f5891606c(arg0, arg1, arg2) {
    const ret = arg0.getSyncParameter(arg1, arg2 >>> 0);
    return ret;
};

export function __wbg_getUniformBlockIndex_288fdc31528171ca(arg0, arg1, arg2, arg3) {
    const ret = arg0.getUniformBlockIndex(arg1, getStringFromWasm0(arg2, arg3));
    return ret;
};

export function __wbg_getUniformLocation_657a2b6d102bd126(arg0, arg1, arg2, arg3) {
    const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_getUniformLocation_838363001c74dc21(arg0, arg1, arg2, arg3) {
    const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_get_3091cb4339203d1a(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_get_4095561f3d5ec806(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_get_8edd839202d9f4db(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_get_b9b93047fe3cf45b(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_get_e27dfaeb6f46bd45(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_gpu_9190c45d483af352(arg0) {
    const ret = arg0.gpu;
    return ret;
};

export function __wbg_hash_dd4b49269c385c8a() { return handleError(function (arg0, arg1) {
    const ret = arg1.hash;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_headers_7852a8ea641c1379(arg0) {
    const ret = arg0.headers;
    return ret;
};

export function __wbg_height_1d93eb7f5e355d97(arg0) {
    const ret = arg0.height;
    return ret;
};

export function __wbg_height_1f8226c8f6875110(arg0) {
    const ret = arg0.height;
    return ret;
};

export function __wbg_height_838cee19ba8597db(arg0) {
    const ret = arg0.height;
    return ret;
};

export function __wbg_height_d3f39e12f0f62121(arg0) {
    const ret = arg0.height;
    return ret;
};

export function __wbg_height_df1aa98dfbbe11ad(arg0) {
    const ret = arg0.height;
    return ret;
};

export function __wbg_height_e3c322f23d99ad2f(arg0) {
    const ret = arg0.height;
    return ret;
};

export function __wbg_hidden_d5c02c79a2b77bb6(arg0) {
    const ret = arg0.hidden;
    return ret;
};

export function __wbg_host_9bd7b5dc07c48606() { return handleError(function (arg0, arg1) {
    const ret = arg1.host;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_hostname_8d7204884eb7378b() { return handleError(function (arg0, arg1) {
    const ret = arg1.hostname;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_href_87d60a783a012377() { return handleError(function (arg0, arg1) {
    const ret = arg1.href;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_id_c65402eae48fb242(arg0, arg1) {
    const ret = arg1.id;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_identifier_59e0705aef81ff93(arg0) {
    const ret = arg0.identifier;
    return ret;
};

export function __wbg_includes_937486a108ec147b(arg0, arg1, arg2) {
    const ret = arg0.includes(arg1, arg2);
    return ret;
};

export function __wbg_info_1fa0a04953ab28a7(arg0, arg1) {
    console.info(getStringFromWasm0(arg0, arg1));
};

export function __wbg_info_3daf2e093e091b66(arg0) {
    console.info(arg0);
};

export function __wbg_inlineSize_8ff96b3ec1b24423(arg0) {
    const ret = arg0.inlineSize;
    return ret;
};

export function __wbg_instanceof_ArrayBuffer_e14585432e3737fc(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_DedicatedWorkerGlobalScope_a688e81380e34e02(arg0) {
    let result;
    try {
        result = arg0 instanceof DedicatedWorkerGlobalScope;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Document_917b7ac52e42682e(arg0) {
    let result;
    try {
        result = arg0 instanceof Document;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Element_0af65443936d5154(arg0) {
    let result;
    try {
        result = arg0 instanceof Element;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_GpuAdapter_0e209d47dbec389c(arg0) {
    let result;
    try {
        result = arg0 instanceof GPUAdapter;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_GpuCanvasContext_e63ee96c5bd33b0b(arg0) {
    let result;
    try {
        result = arg0 instanceof GPUCanvasContext;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_HtmlCanvasElement_2ea67072a7624ac5(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLCanvasElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_HtmlElement_51378c201250b16c(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_HtmlInputElement_12d71bf2d15dd19e(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLInputElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_ImageBitmap_d093d508663e313d(arg0) {
    let result;
    try {
        result = arg0 instanceof ImageBitmap;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_ResizeObserverEntry_cb85a268a84783ba(arg0) {
    let result;
    try {
        result = arg0 instanceof ResizeObserverEntry;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_ResizeObserverSize_4138fd53d59e1653(arg0) {
    let result;
    try {
        result = arg0 instanceof ResizeObserverSize;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Response_f2cc20d9f7dfd644(arg0) {
    let result;
    try {
        result = arg0 instanceof Response;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_ShadowRoot_726578bcd7fa418a(arg0) {
    let result;
    try {
        result = arg0 instanceof ShadowRoot;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_17156bcf118086a9(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_WebGl2RenderingContext_2b6045efeb76568d(arg0) {
    let result;
    try {
        result = arg0 instanceof WebGL2RenderingContext;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Window_def73ea0955fc569(arg0) {
    let result;
    try {
        result = arg0 instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_WorkerGlobalScope_dbdbdea7e3b56493(arg0) {
    let result;
    try {
        result = arg0 instanceof WorkerGlobalScope;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_invalidateFramebuffer_83f643d2a4936456() { return handleError(function (arg0, arg1, arg2) {
    arg0.invalidateFramebuffer(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_isArray_a1eab7e0d067391b(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

export function __wbg_isComposing_36511555ff1869a4(arg0) {
    const ret = arg0.isComposing;
    return ret;
};

export function __wbg_isComposing_6e36768c82fd5a4f(arg0) {
    const ret = arg0.isComposing;
    return ret;
};

export function __wbg_isSafeInteger_343e2beeeece1bb0(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
};

export function __wbg_isSecureContext_aedcf3816338189a(arg0) {
    const ret = arg0.isSecureContext;
    return ret;
};

export function __wbg_is_c7481c65e7e5df9e(arg0, arg1) {
    const ret = Object.is(arg0, arg1);
    return ret;
};

export function __wbg_item_aea4b8432b5457be(arg0, arg1) {
    const ret = arg0.item(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_items_89c2afbece3a5d13(arg0) {
    const ret = arg0.items;
    return ret;
};

export function __wbg_keyCode_237a8d1a040910b8(arg0) {
    const ret = arg0.keyCode;
    return ret;
};

export function __wbg_key_7b5c6cb539be8e13(arg0, arg1) {
    const ret = arg1.key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_label_1f84f92f09ba5b0a(arg0, arg1) {
    const ret = arg1.label;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_lastModified_7a9e61b3961224b8(arg0) {
    const ret = arg0.lastModified;
    return ret;
};

export function __wbg_left_e46801720267b66d(arg0) {
    const ret = arg0.left;
    return ret;
};

export function __wbg_length_1d5c829e9b2319d6(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_802483321c8130cf(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_a446193dc22c12f8(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_cfc862ec0ccc7ca0(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_e2d2a49132c1b256(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_limits_e57569af160aeddc(arg0) {
    const ret = arg0.limits;
    return ret;
};

export function __wbg_linkProgram_067ee06739bdde81(arg0, arg1) {
    arg0.linkProgram(arg1);
};

export function __wbg_linkProgram_e002979fe36e5b2a(arg0, arg1) {
    arg0.linkProgram(arg1);
};

export function __wbg_localStorage_1406c99c39728187() { return handleError(function (arg0) {
    const ret = arg0.localStorage;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_location_350d99456c2f3693(arg0) {
    const ret = arg0.location;
    return ret;
};

export function __wbg_log_c222819a41e063d3(arg0) {
    console.log(arg0);
};

export function __wbg_mapAsync_6c6e4e801161924c(arg0, arg1, arg2, arg3) {
    const ret = arg0.mapAsync(arg1 >>> 0, arg2, arg3);
    return ret;
};

export function __wbg_matchMedia_bf8807a841d930c1() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.matchMedia(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_matches_e9ca73fbf8a3a104(arg0) {
    const ret = arg0.matches;
    return ret;
};

export function __wbg_matches_f579d2efd905ab4f(arg0) {
    const ret = arg0.matches;
    return ret;
};

export function __wbg_maxBindGroups_38117bf16c093492(arg0) {
    const ret = arg0.maxBindGroups;
    return ret;
};

export function __wbg_maxBindingsPerBindGroup_4c83aa7d3b0f0bf9(arg0) {
    const ret = arg0.maxBindingsPerBindGroup;
    return ret;
};

export function __wbg_maxBufferSize_0476342fcdb63944(arg0) {
    const ret = arg0.maxBufferSize;
    return ret;
};

export function __wbg_maxColorAttachmentBytesPerSample_dd065943c2c074c9(arg0) {
    const ret = arg0.maxColorAttachmentBytesPerSample;
    return ret;
};

export function __wbg_maxColorAttachments_cdd33ae159d907c3(arg0) {
    const ret = arg0.maxColorAttachments;
    return ret;
};

export function __wbg_maxComputeInvocationsPerWorkgroup_f18a0e7cc360a4f2(arg0) {
    const ret = arg0.maxComputeInvocationsPerWorkgroup;
    return ret;
};

export function __wbg_maxComputeWorkgroupSizeX_c8a05f62d09395f4(arg0) {
    const ret = arg0.maxComputeWorkgroupSizeX;
    return ret;
};

export function __wbg_maxComputeWorkgroupSizeY_749851b448366c6b(arg0) {
    const ret = arg0.maxComputeWorkgroupSizeY;
    return ret;
};

export function __wbg_maxComputeWorkgroupSizeZ_c53cc29df955ae5a(arg0) {
    const ret = arg0.maxComputeWorkgroupSizeZ;
    return ret;
};

export function __wbg_maxComputeWorkgroupStorageSize_1b473a4049c8b908(arg0) {
    const ret = arg0.maxComputeWorkgroupStorageSize;
    return ret;
};

export function __wbg_maxComputeWorkgroupsPerDimension_9ff46dd341f1489f(arg0) {
    const ret = arg0.maxComputeWorkgroupsPerDimension;
    return ret;
};

export function __wbg_maxDynamicStorageBuffersPerPipelineLayout_6f2531c8b3946fe7(arg0) {
    const ret = arg0.maxDynamicStorageBuffersPerPipelineLayout;
    return ret;
};

export function __wbg_maxDynamicUniformBuffersPerPipelineLayout_6532ba0f61691f92(arg0) {
    const ret = arg0.maxDynamicUniformBuffersPerPipelineLayout;
    return ret;
};

export function __wbg_maxSampledTexturesPerShaderStage_1e300c1893a44019(arg0) {
    const ret = arg0.maxSampledTexturesPerShaderStage;
    return ret;
};

export function __wbg_maxSamplersPerShaderStage_b2f4886a8bf432e9(arg0) {
    const ret = arg0.maxSamplersPerShaderStage;
    return ret;
};

export function __wbg_maxStorageBufferBindingSize_1664cce2578d8011(arg0) {
    const ret = arg0.maxStorageBufferBindingSize;
    return ret;
};

export function __wbg_maxStorageBuffersPerShaderStage_41c3a49271bb26d0(arg0) {
    const ret = arg0.maxStorageBuffersPerShaderStage;
    return ret;
};

export function __wbg_maxStorageTexturesPerShaderStage_090ef077886867b7(arg0) {
    const ret = arg0.maxStorageTexturesPerShaderStage;
    return ret;
};

export function __wbg_maxTextureArrayLayers_6ad2737805de682c(arg0) {
    const ret = arg0.maxTextureArrayLayers;
    return ret;
};

export function __wbg_maxTextureDimension1D_f034b80a9155ce7a(arg0) {
    const ret = arg0.maxTextureDimension1D;
    return ret;
};

export function __wbg_maxTextureDimension2D_97d03cbc330a1de6(arg0) {
    const ret = arg0.maxTextureDimension2D;
    return ret;
};

export function __wbg_maxTextureDimension3D_9cb354a662c690a7(arg0) {
    const ret = arg0.maxTextureDimension3D;
    return ret;
};

export function __wbg_maxUniformBufferBindingSize_376fb4aa02284b9b(arg0) {
    const ret = arg0.maxUniformBufferBindingSize;
    return ret;
};

export function __wbg_maxUniformBuffersPerShaderStage_77c6612a2878a56b(arg0) {
    const ret = arg0.maxUniformBuffersPerShaderStage;
    return ret;
};

export function __wbg_maxVertexAttributes_0a768d9af99844e2(arg0) {
    const ret = arg0.maxVertexAttributes;
    return ret;
};

export function __wbg_maxVertexBufferArrayStride_3c84c7f70e4ce587(arg0) {
    const ret = arg0.maxVertexBufferArrayStride;
    return ret;
};

export function __wbg_maxVertexBuffers_ddcf4555a965d888(arg0) {
    const ret = arg0.maxVertexBuffers;
    return ret;
};

export function __wbg_metaKey_0b25f7848e014cc8(arg0) {
    const ret = arg0.metaKey;
    return ret;
};

export function __wbg_metaKey_e1dd47d709a80ce5(arg0) {
    const ret = arg0.metaKey;
    return ret;
};

export function __wbg_minStorageBufferOffsetAlignment_630d33ba02e6ace7(arg0) {
    const ret = arg0.minStorageBufferOffsetAlignment;
    return ret;
};

export function __wbg_minUniformBufferOffsetAlignment_ed951280a2dc56cd(arg0) {
    const ret = arg0.minUniformBufferOffsetAlignment;
    return ret;
};

export function __wbg_msCrypto_a61aeb35a24c1329(arg0) {
    const ret = arg0.msCrypto;
    return ret;
};

export function __wbg_name_28c43f147574bf08(arg0, arg1) {
    const ret = arg1.name;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_navigator_0a9bf1120e24fec2(arg0) {
    const ret = arg0.navigator;
    return ret;
};

export function __wbg_navigator_1577371c070c8947(arg0) {
    const ret = arg0.navigator;
    return ret;
};

export function __wbg_new_405e22f390576ce2() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_5136e00935bbc0fc() {
    const ret = new Error();
    return ret;
};

export function __wbg_new_5f34cc0c99fcc488() { return handleError(function (arg0) {
    const ret = new ResizeObserver(arg0);
    return ret;
}, arguments) };

export function __wbg_new_78feb108b6472713() {
    const ret = new Array();
    return ret;
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
};

export function __wbg_new_a12002a7f91c75be(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_newnoargs_105ed471475aaf50(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_840f3c038856d4e9(arg0, arg1, arg2) {
    const ret = new Int8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_999332a180064b59(arg0, arg1, arg2) {
    const ret = new Int32Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_d4a86622320ea258(arg0, arg1, arg2) {
    const ret = new Uint16Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_e6b7e69acd4c7354(arg0, arg1, arg2) {
    const ret = new Float32Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_f1dead44d1fc7212(arg0, arg1, arg2) {
    const ret = new Uint32Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_f254047f7e80e7ff(arg0, arg1, arg2) {
    const ret = new Int16Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithlength_a381634e90c276d4(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
};

export function __wbg_newwithrecordfromstrtoblobpromise_53d3e3611a048f1e() { return handleError(function (arg0) {
    const ret = new ClipboardItem(arg0);
    return ret;
}, arguments) };

export function __wbg_newwithstrandinit_06c535e0a867c635() { return handleError(function (arg0, arg1, arg2) {
    const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
    return ret;
}, arguments) };

export function __wbg_newwithu8arraysequence_1e24f242a67f6fdd() { return handleError(function (arg0) {
    const ret = new Blob(arg0);
    return ret;
}, arguments) };

export function __wbg_newwithu8arraysequenceandoptions_068570c487f69127() { return handleError(function (arg0, arg1) {
    const ret = new Blob(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_node_905d3e251edff8a2(arg0) {
    const ret = arg0.node;
    return ret;
};

export function __wbg_now_2c95c9de01293173(arg0) {
    const ret = arg0.now();
    return ret;
};

export function __wbg_now_807e54c39636c349() {
    const ret = Date.now();
    return ret;
};

export function __wbg_now_d18023d54d4e5500(arg0) {
    const ret = arg0.now();
    return ret;
};

export function __wbg_observe_ed4adb1c245103c5(arg0, arg1, arg2) {
    arg0.observe(arg1, arg2);
};

export function __wbg_of_2eaf5a02d443ef03(arg0) {
    const ret = Array.of(arg0);
    return ret;
};

export function __wbg_offsetTop_de8d0722bd1b211d(arg0) {
    const ret = arg0.offsetTop;
    return ret;
};

export function __wbg_open_6c3f5ef5a0204c5d() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    const ret = arg0.open(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_origin_7c5d649acdace3ea() { return handleError(function (arg0, arg1) {
    const ret = arg1.origin;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_performance_7a3ffd0b17f663ad(arg0) {
    const ret = arg0.performance;
    return ret;
};

export function __wbg_performance_c185c0cdc2766575(arg0) {
    const ret = arg0.performance;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_pixelStorei_6aba5d04cdcaeaf6(arg0, arg1, arg2) {
    arg0.pixelStorei(arg1 >>> 0, arg2);
};

export function __wbg_pixelStorei_c8520e4b46f4a973(arg0, arg1, arg2) {
    arg0.pixelStorei(arg1 >>> 0, arg2);
};

export function __wbg_polygonOffset_773fe0017b2c8f51(arg0, arg1, arg2) {
    arg0.polygonOffset(arg1, arg2);
};

export function __wbg_polygonOffset_8c11c066486216c4(arg0, arg1, arg2) {
    arg0.polygonOffset(arg1, arg2);
};

export function __wbg_port_008e0061f421df1d() { return handleError(function (arg0, arg1) {
    const ret = arg1.port;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_postMessage_83a8d58d3fcb6c13() { return handleError(function (arg0, arg1) {
    arg0.postMessage(arg1);
}, arguments) };

export function __wbg_preventDefault_c2314fd813c02b3c(arg0) {
    arg0.preventDefault();
};

export function __wbg_process_dc0fbacc7c1c06f7(arg0) {
    const ret = arg0.process;
    return ret;
};

export function __wbg_protocol_faa0494a9b2554cb() { return handleError(function (arg0, arg1) {
    const ret = arg1.protocol;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_push_737cfc8c1432c2c6(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
};

export function __wbg_queryCounterEXT_7aed85645b7ec1da(arg0, arg1, arg2) {
    arg0.queryCounterEXT(arg1, arg2 >>> 0);
};

export function __wbg_querySelectorAll_40998fd748f057ef() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.querySelectorAll(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_querySelector_c69f8b573958906b() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_queueMicrotask_97d92b4fcc8a61c5(arg0) {
    queueMicrotask(arg0);
};

export function __wbg_queueMicrotask_d3219def82552485(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
};

export function __wbg_queue_d89a02421bda2b42(arg0) {
    const ret = arg0.queue;
    return ret;
};

export function __wbg_randomFillSync_ac0988aba3254290() { return handleError(function (arg0, arg1) {
    arg0.randomFillSync(arg1);
}, arguments) };

export function __wbg_readBuffer_1c35b1e4939f881d(arg0, arg1) {
    arg0.readBuffer(arg1 >>> 0);
};

export function __wbg_readPixels_51a0c02cdee207a5() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
}, arguments) };

export function __wbg_readPixels_a6cbb21794452142() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
}, arguments) };

export function __wbg_readPixels_cd64c5a7b0343355() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
}, arguments) };

export function __wbg_removeEventListener_056dfe8c3d6c58f9() { return handleError(function (arg0, arg1, arg2, arg3) {
    arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
}, arguments) };

export function __wbg_remove_e2d2659f3128c045(arg0) {
    arg0.remove();
};

export function __wbg_renderbufferStorageMultisample_13fbd5e58900c6fe(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.renderbufferStorageMultisample(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_renderbufferStorage_73e01ea83b8afab4(arg0, arg1, arg2, arg3, arg4) {
    arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
};

export function __wbg_renderbufferStorage_f010012bd3566942(arg0, arg1, arg2, arg3, arg4) {
    arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
};

export function __wbg_requestAdapter_5c43f295f007713d(arg0) {
    const ret = arg0.requestAdapter();
    return ret;
};

export function __wbg_requestAdapter_aa6a84b375129705(arg0, arg1) {
    const ret = arg0.requestAdapter(arg1);
    return ret;
};

export function __wbg_requestAnimationFrame_d7fd890aaefc3246() { return handleError(function (arg0, arg1) {
    const ret = arg0.requestAnimationFrame(arg1);
    return ret;
}, arguments) };

export function __wbg_requestDevice_c5987173ae76ad9e(arg0, arg1) {
    const ret = arg0.requestDevice(arg1);
    return ret;
};

export function __wbg_require_60cc747a6bc5215a() { return handleError(function () {
    const ret = module.require;
    return ret;
}, arguments) };

export function __wbg_resolve_4851785c9c5f573d(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
};

export function __wbg_right_54416a875852cab1(arg0) {
    const ret = arg0.right;
    return ret;
};

export function __wbg_samplerParameterf_909baf50360c94d4(arg0, arg1, arg2, arg3) {
    arg0.samplerParameterf(arg1, arg2 >>> 0, arg3);
};

export function __wbg_samplerParameteri_d5c292172718da63(arg0, arg1, arg2, arg3) {
    arg0.samplerParameteri(arg1, arg2 >>> 0, arg3);
};

export function __wbg_scissor_e917a332f67a5d30(arg0, arg1, arg2, arg3, arg4) {
    arg0.scissor(arg1, arg2, arg3, arg4);
};

export function __wbg_scissor_eb177ca33bf24a44(arg0, arg1, arg2, arg3, arg4) {
    arg0.scissor(arg1, arg2, arg3, arg4);
};

export function __wbg_search_c1c3bfbeadd96c47() { return handleError(function (arg0, arg1) {
    const ret = arg1.search;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_setAttribute_2704501201f15687() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_setBindGroup_27c30b4102caa9b5() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
}, arguments) };

export function __wbg_setBindGroup_ee52514c4b556355(arg0, arg1, arg2) {
    arg0.setBindGroup(arg1 >>> 0, arg2);
};

export function __wbg_setIndexBuffer_39a68108e1d1f2fe(arg0, arg1, arg2, arg3, arg4) {
    arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
};

export function __wbg_setIndexBuffer_7568edd0661b1eec(arg0, arg1, arg2, arg3) {
    arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3);
};

export function __wbg_setItem_212ecc915942ab0a() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setItem(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_setPipeline_ecea0c935f856520(arg0, arg1) {
    arg0.setPipeline(arg1);
};

export function __wbg_setProperty_f2cf326652b9a713() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_setScissorRect_ca8fe9826022cfbe(arg0, arg1, arg2, arg3, arg4) {
    arg0.setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_setStencilReference_bd9aa36a3c527fdb(arg0, arg1) {
    arg0.setStencilReference(arg1 >>> 0);
};

export function __wbg_setVertexBuffer_33886152808377d7(arg0, arg1, arg2, arg3) {
    arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3);
};

export function __wbg_setVertexBuffer_a9ecef28279cc0a7(arg0, arg1, arg2, arg3, arg4) {
    arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3, arg4);
};

export function __wbg_setViewport_b5633500d442f2ac(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.setViewport(arg1, arg2, arg3, arg4, arg5, arg6);
};

export function __wbg_set_11cd83f45504cedf() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

export function __wbg_set_bb8cecf6a62b9f46() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(arg0, arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_seta_e614a7cab362a0f6(arg0, arg1) {
    arg0.a = arg1;
};

export function __wbg_setaccess_7a29a6624061bd22(arg0, arg1) {
    arg0.access = __wbindgen_enum_GpuStorageTextureAccess[arg1];
};

export function __wbg_setaddressmodeu_f9c59da53d82b182(arg0, arg1) {
    arg0.addressModeU = __wbindgen_enum_GpuAddressMode[arg1];
};

export function __wbg_setaddressmodev_79f77a1d3b044c97(arg0, arg1) {
    arg0.addressModeV = __wbindgen_enum_GpuAddressMode[arg1];
};

export function __wbg_setaddressmodew_18409dbb4043703c(arg0, arg1) {
    arg0.addressModeW = __wbindgen_enum_GpuAddressMode[arg1];
};

export function __wbg_setalpha_f5ce555a0b46c02f(arg0, arg1) {
    arg0.alpha = arg1;
};

export function __wbg_setalphamode_31d7395a6784e4ac(arg0, arg1) {
    arg0.alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1];
};

export function __wbg_setalphatocoverageenabled_6831ffd3db78874a(arg0, arg1) {
    arg0.alphaToCoverageEnabled = arg1 !== 0;
};

export function __wbg_setarraylayercount_de280b62410c0673(arg0, arg1) {
    arg0.arrayLayerCount = arg1 >>> 0;
};

export function __wbg_setarraystride_a81326f8d942e90a(arg0, arg1) {
    arg0.arrayStride = arg1;
};

export function __wbg_setaspect_2a0a5d6b91e46292(arg0, arg1) {
    arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
};

export function __wbg_setaspect_8da0cc41e9c723ce(arg0, arg1) {
    arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
};

export function __wbg_setattributes_a8815b2a94cbbd5d(arg0, arg1) {
    arg0.attributes = arg1;
};

export function __wbg_setautofocus_6ca6f0ab5a566c21() { return handleError(function (arg0, arg1) {
    arg0.autofocus = arg1 !== 0;
}, arguments) };

export function __wbg_setb_6a3df80fce7389c4(arg0, arg1) {
    arg0.b = arg1;
};

export function __wbg_setbasearraylayer_816072c4f15dac6d(arg0, arg1) {
    arg0.baseArrayLayer = arg1 >>> 0;
};

export function __wbg_setbasemiplevel_ce0ddf04be35efe0(arg0, arg1) {
    arg0.baseMipLevel = arg1 >>> 0;
};

export function __wbg_setbeginningofpasswriteindex_db074583a3fde2ff(arg0, arg1) {
    arg0.beginningOfPassWriteIndex = arg1 >>> 0;
};

export function __wbg_setbindgrouplayouts_a2670a6cfcb7c490(arg0, arg1) {
    arg0.bindGroupLayouts = arg1;
};

export function __wbg_setbinding_d47488349a99da1f(arg0, arg1) {
    arg0.binding = arg1 >>> 0;
};

export function __wbg_setbinding_f935678f007077c3(arg0, arg1) {
    arg0.binding = arg1 >>> 0;
};

export function __wbg_setblend_5fff4fc1a8804e7b(arg0, arg1) {
    arg0.blend = arg1;
};

export function __wbg_setbox_2786f3ccea97cac4(arg0, arg1) {
    arg0.box = __wbindgen_enum_ResizeObserverBoxOptions[arg1];
};

export function __wbg_setbuffer_6b2d0975dd5b4804(arg0, arg1) {
    arg0.buffer = arg1;
};

export function __wbg_setbuffer_8953e54ed1e614bf(arg0, arg1) {
    arg0.buffer = arg1;
};

export function __wbg_setbuffer_b8d4b873f193738d(arg0, arg1) {
    arg0.buffer = arg1;
};

export function __wbg_setbuffers_67cf19c4a2c975fe(arg0, arg1) {
    arg0.buffers = arg1;
};

export function __wbg_setbytesperrow_38a272f24fa45c75(arg0, arg1) {
    arg0.bytesPerRow = arg1 >>> 0;
};

export function __wbg_setbytesperrow_f40ece00f6ad8093(arg0, arg1) {
    arg0.bytesPerRow = arg1 >>> 0;
};

export function __wbg_setclearvalue_2f2afd13b6ecba90(arg0, arg1) {
    arg0.clearValue = arg1;
};

export function __wbg_setcode_0f3b7e02272be293(arg0, arg1, arg2) {
    arg0.code = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setcolor_256b6f0175930e17(arg0, arg1) {
    arg0.color = arg1;
};

export function __wbg_setcolorattachments_9c00dda5b4a96cf3(arg0, arg1) {
    arg0.colorAttachments = arg1;
};

export function __wbg_setcompare_11640e1237f574d1(arg0, arg1) {
    arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
};

export function __wbg_setcompare_63ca4199bc88569b(arg0, arg1) {
    arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
};

export function __wbg_setcount_3e7fbced19a28758(arg0, arg1) {
    arg0.count = arg1 >>> 0;
};

export function __wbg_setcullmode_17d54fcc4a1d899e(arg0, arg1) {
    arg0.cullMode = __wbindgen_enum_GpuCullMode[arg1];
};

export function __wbg_setdepthbias_0b1e19c4eeb8bf9b(arg0, arg1) {
    arg0.depthBias = arg1;
};

export function __wbg_setdepthbiasclamp_a00c0504aa10e802(arg0, arg1) {
    arg0.depthBiasClamp = arg1;
};

export function __wbg_setdepthbiasslopescale_0c335ba5dd4159a6(arg0, arg1) {
    arg0.depthBiasSlopeScale = arg1;
};

export function __wbg_setdepthclearvalue_24a007bba21e50e4(arg0, arg1) {
    arg0.depthClearValue = arg1;
};

export function __wbg_setdepthcompare_379f582e7e2d6f8a(arg0, arg1) {
    arg0.depthCompare = __wbindgen_enum_GpuCompareFunction[arg1];
};

export function __wbg_setdepthfailop_875b03aacfe7f3d7(arg0, arg1) {
    arg0.depthFailOp = __wbindgen_enum_GpuStencilOperation[arg1];
};

export function __wbg_setdepthloadop_694e998dee78f58e(arg0, arg1) {
    arg0.depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
};

export function __wbg_setdepthorarraylayers_0d411b81883f9e4a(arg0, arg1) {
    arg0.depthOrArrayLayers = arg1 >>> 0;
};

export function __wbg_setdepthreadonly_df26e44e0338852d(arg0, arg1) {
    arg0.depthReadOnly = arg1 !== 0;
};

export function __wbg_setdepthstencil_a6ca739cea762217(arg0, arg1) {
    arg0.depthStencil = arg1;
};

export function __wbg_setdepthstencilattachment_6a1d2ba719cd889a(arg0, arg1) {
    arg0.depthStencilAttachment = arg1;
};

export function __wbg_setdepthstoreop_04c091c28c8cb198(arg0, arg1) {
    arg0.depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
};

export function __wbg_setdepthwriteenabled_72e1e785a5a5a262(arg0, arg1) {
    arg0.depthWriteEnabled = arg1 !== 0;
};

export function __wbg_setdevice_cf9c35b42aae95e2(arg0, arg1) {
    arg0.device = arg1;
};

export function __wbg_setdimension_0c4c84631949b62b(arg0, arg1) {
    arg0.dimension = __wbindgen_enum_GpuTextureDimension[arg1];
};

export function __wbg_setdimension_d5b6c997c987a35f(arg0, arg1) {
    arg0.dimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
};

export function __wbg_setdstfactor_f5aa0d40a8a46209(arg0, arg1) {
    arg0.dstFactor = __wbindgen_enum_GpuBlendFactor[arg1];
};

export function __wbg_setendofpasswriteindex_9df3c78cc7108787(arg0, arg1) {
    arg0.endOfPassWriteIndex = arg1 >>> 0;
};

export function __wbg_setentries_31f9d7a61735820c(arg0, arg1) {
    arg0.entries = arg1;
};

export function __wbg_setentries_c4c1438ed3550798(arg0, arg1) {
    arg0.entries = arg1;
};

export function __wbg_setentrypoint_5fc49eccf7a2a917(arg0, arg1, arg2) {
    arg0.entryPoint = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setentrypoint_7a48e2fd45ce5242(arg0, arg1, arg2) {
    arg0.entryPoint = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setfailop_b3aa7b676802d507(arg0, arg1) {
    arg0.failOp = __wbindgen_enum_GpuStencilOperation[arg1];
};

export function __wbg_setflipy_07e27e9b8f79ebac(arg0, arg1) {
    arg0.flipY = arg1 !== 0;
};

export function __wbg_setformat_4d274f92eb43af7e(arg0, arg1) {
    arg0.format = __wbindgen_enum_GpuVertexFormat[arg1];
};

export function __wbg_setformat_4f4d8e1c3af29385(arg0, arg1) {
    arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_setformat_6c986b1fbf5a8135(arg0, arg1) {
    arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_setformat_999b10709ff9fbb3(arg0, arg1) {
    arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_setformat_a248be0e94937fd6(arg0, arg1) {
    arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_setformat_e1ab7966762071ac(arg0, arg1) {
    arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_setformat_e32999833a5a4c3a(arg0, arg1) {
    arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_setfragment_a7b4d1d6e4173869(arg0, arg1) {
    arg0.fragment = arg1;
};

export function __wbg_setfrontface_2af45fe851357ed5(arg0, arg1) {
    arg0.frontFace = __wbindgen_enum_GpuFrontFace[arg1];
};

export function __wbg_setg_e2da37d4015a5cba(arg0, arg1) {
    arg0.g = arg1;
};

export function __wbg_sethasdynamicoffset_cb46ff65a09728e7(arg0, arg1) {
    arg0.hasDynamicOffset = arg1 !== 0;
};

export function __wbg_setheight_07e23125a705916b(arg0, arg1) {
    arg0.height = arg1 >>> 0;
};

export function __wbg_setheight_433680330c9420c3(arg0, arg1) {
    arg0.height = arg1 >>> 0;
};

export function __wbg_setheight_da683a33fa99843c(arg0, arg1) {
    arg0.height = arg1 >>> 0;
};

export function __wbg_setinnerHTML_31bde41f835786f7(arg0, arg1, arg2) {
    arg0.innerHTML = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_2b771b9d670d425d(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_2da44266df5c13ed(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_4ad48f653ec65eb3(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_500d4bf5cd901261(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_71035c60ff875bcb(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_8ebf2908004a93a8(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_a500f3f38501fd17(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_a715a723e54be347(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_b1dea0fd6b833499(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_d9721be24ba962d0(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_ee195a522e4e446e(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_f37c9286a746ea88(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlabel_f63950a596f3822e(arg0, arg1, arg2) {
    arg0.label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setlayout_07cd9903ecafe648(arg0, arg1) {
    arg0.layout = arg1;
};

export function __wbg_setlayout_9de5ead36a343003(arg0, arg1) {
    arg0.layout = arg1;
};

export function __wbg_setloadop_7717864ef29efe5a(arg0, arg1) {
    arg0.loadOp = __wbindgen_enum_GpuLoadOp[arg1];
};

export function __wbg_setlodmaxclamp_1887e84a3d06f898(arg0, arg1) {
    arg0.lodMaxClamp = arg1;
};

export function __wbg_setlodminclamp_cd3dd55fe2bb52d8(arg0, arg1) {
    arg0.lodMinClamp = arg1;
};

export function __wbg_setmagfilter_52da4c654280e213(arg0, arg1) {
    arg0.magFilter = __wbindgen_enum_GpuFilterMode[arg1];
};

export function __wbg_setmappedatcreation_a8895d0463a7c2b4(arg0, arg1) {
    arg0.mappedAtCreation = arg1 !== 0;
};

export function __wbg_setmask_55b58b7d5ccae3c9(arg0, arg1) {
    arg0.mask = arg1 >>> 0;
};

export function __wbg_setmaxanisotropy_1ca629f4e25e12fd(arg0, arg1) {
    arg0.maxAnisotropy = arg1;
};

export function __wbg_setmethod_3c5280fe5d890842(arg0, arg1, arg2) {
    arg0.method = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setminbindingsize_e6ebb4f885a7e096(arg0, arg1) {
    arg0.minBindingSize = arg1;
};

export function __wbg_setminfilter_58e87776cadcd1b3(arg0, arg1) {
    arg0.minFilter = __wbindgen_enum_GpuFilterMode[arg1];
};

export function __wbg_setmiplevel_6b898ddd34646f69(arg0, arg1) {
    arg0.mipLevel = arg1 >>> 0;
};

export function __wbg_setmiplevel_6fed1be31117eadb(arg0, arg1) {
    arg0.mipLevel = arg1 >>> 0;
};

export function __wbg_setmiplevelcount_05871e66fd4a8a4f(arg0, arg1) {
    arg0.mipLevelCount = arg1 >>> 0;
};

export function __wbg_setmiplevelcount_5cdccf5992bb17da(arg0, arg1) {
    arg0.mipLevelCount = arg1 >>> 0;
};

export function __wbg_setmipmapfilter_182e70118e958b7f(arg0, arg1) {
    arg0.mipmapFilter = __wbindgen_enum_GpuMipmapFilterMode[arg1];
};

export function __wbg_setmode_5dc300b865044b65(arg0, arg1) {
    arg0.mode = __wbindgen_enum_RequestMode[arg1];
};

export function __wbg_setmodule_6575b8b8b6395d5e(arg0, arg1) {
    arg0.module = arg1;
};

export function __wbg_setmodule_b2a1ad7c5aa169a6(arg0, arg1) {
    arg0.module = arg1;
};

export function __wbg_setmultisample_0ab87d309246882a(arg0, arg1) {
    arg0.multisample = arg1;
};

export function __wbg_setmultisampled_5bbeb86cec3c3b77(arg0, arg1) {
    arg0.multisampled = arg1 !== 0;
};

export function __wbg_setoffset_03942acfc179b9e4(arg0, arg1) {
    arg0.offset = arg1;
};

export function __wbg_setoffset_2a1ed8c605246680(arg0, arg1) {
    arg0.offset = arg1;
};

export function __wbg_setoffset_b2b5cabe142e1121(arg0, arg1) {
    arg0.offset = arg1;
};

export function __wbg_setoffset_faa7816201305e71(arg0, arg1) {
    arg0.offset = arg1;
};

export function __wbg_setonce_0cb80aea26303a35(arg0, arg1) {
    arg0.once = arg1 !== 0;
};

export function __wbg_setoperation_b1320c8f97dc317a(arg0, arg1) {
    arg0.operation = __wbindgen_enum_GpuBlendOperation[arg1];
};

export function __wbg_setorigin_0ef9b6c92d971672(arg0, arg1) {
    arg0.origin = arg1;
};

export function __wbg_setorigin_bce4abc33252aae4(arg0, arg1) {
    arg0.origin = arg1;
};

export function __wbg_setorigin_c9a426d82a4cbb67(arg0, arg1) {
    arg0.origin = arg1;
};

export function __wbg_setpassop_3864d7967d0b755f(arg0, arg1) {
    arg0.passOp = __wbindgen_enum_GpuStencilOperation[arg1];
};

export function __wbg_setpowerpreference_f55bb01532e63a16(arg0, arg1) {
    arg0.powerPreference = __wbindgen_enum_GpuPowerPreference[arg1];
};

export function __wbg_setpremultipliedalpha_36161b868cbca098(arg0, arg1) {
    arg0.premultipliedAlpha = arg1 !== 0;
};

export function __wbg_setprimitive_8e59242385aeefbd(arg0, arg1) {
    arg0.primitive = arg1;
};

export function __wbg_setqueryset_1d4d053148acad3d(arg0, arg1) {
    arg0.querySet = arg1;
};

export function __wbg_setr_323d10232d162bc5(arg0, arg1) {
    arg0.r = arg1;
};

export function __wbg_setrequiredfeatures_4aaba5b9bed02f6c(arg0, arg1) {
    arg0.requiredFeatures = arg1;
};

export function __wbg_setresolvetarget_93c553085f84be1d(arg0, arg1) {
    arg0.resolveTarget = arg1;
};

export function __wbg_setresource_da805678f095daba(arg0, arg1) {
    arg0.resource = arg1;
};

export function __wbg_setrowsperimage_a20532b7306f8f04(arg0, arg1) {
    arg0.rowsPerImage = arg1 >>> 0;
};

export function __wbg_setrowsperimage_a5c86bbe579e7ff5(arg0, arg1) {
    arg0.rowsPerImage = arg1 >>> 0;
};

export function __wbg_setsamplecount_ba2d094c32b25f63(arg0, arg1) {
    arg0.sampleCount = arg1 >>> 0;
};

export function __wbg_setsampler_907171f78b25e6a0(arg0, arg1) {
    arg0.sampler = arg1;
};

export function __wbg_setsampletype_128e447eb57f81e0(arg0, arg1) {
    arg0.sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];
};

export function __wbg_setshaderlocation_d912fa16e1bafbf5(arg0, arg1) {
    arg0.shaderLocation = arg1 >>> 0;
};

export function __wbg_setsize_26f6f424f8c7ad78(arg0, arg1) {
    arg0.size = arg1;
};

export function __wbg_setsize_77e119b004938be3(arg0, arg1) {
    arg0.size = arg1;
};

export function __wbg_setsize_f475ae0c88ae5c1a(arg0, arg1) {
    arg0.size = arg1;
};

export function __wbg_setsource_02e8b4daaf0b821a(arg0, arg1) {
    arg0.source = arg1;
};

export function __wbg_setsrcfactor_c06f8886e8f9db36(arg0, arg1) {
    arg0.srcFactor = __wbindgen_enum_GpuBlendFactor[arg1];
};

export function __wbg_setstencilback_7430953411a74f5b(arg0, arg1) {
    arg0.stencilBack = arg1;
};

export function __wbg_setstencilclearvalue_82445ec7d3bf6337(arg0, arg1) {
    arg0.stencilClearValue = arg1 >>> 0;
};

export function __wbg_setstencilfront_643b00ca15f63df0(arg0, arg1) {
    arg0.stencilFront = arg1;
};

export function __wbg_setstencilloadop_fd4992092c35e435(arg0, arg1) {
    arg0.stencilLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
};

export function __wbg_setstencilreadmask_417cc42a4ebcc6fd(arg0, arg1) {
    arg0.stencilReadMask = arg1 >>> 0;
};

export function __wbg_setstencilreadonly_b63e58c25fd519fa(arg0, arg1) {
    arg0.stencilReadOnly = arg1 !== 0;
};

export function __wbg_setstencilstoreop_85e35c733e931690(arg0, arg1) {
    arg0.stencilStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
};

export function __wbg_setstencilwritemask_99630e6d9578db18(arg0, arg1) {
    arg0.stencilWriteMask = arg1 >>> 0;
};

export function __wbg_setstepmode_48ca51aca6c457d0(arg0, arg1) {
    arg0.stepMode = __wbindgen_enum_GpuVertexStepMode[arg1];
};

export function __wbg_setstoragetexture_073162508208dde1(arg0, arg1) {
    arg0.storageTexture = arg1;
};

export function __wbg_setstoreop_33000b14c26a958c(arg0, arg1) {
    arg0.storeOp = __wbindgen_enum_GpuStoreOp[arg1];
};

export function __wbg_setstripindexformat_6e6466458d40548f(arg0, arg1) {
    arg0.stripIndexFormat = __wbindgen_enum_GpuIndexFormat[arg1];
};

export function __wbg_settabIndex_31adfec3c7eafbce(arg0, arg1) {
    arg0.tabIndex = arg1;
};

export function __wbg_settargets_9b07a81a153bd198(arg0, arg1) {
    arg0.targets = arg1;
};

export function __wbg_settexture_372c227c16e4476c(arg0, arg1) {
    arg0.texture = arg1;
};

export function __wbg_settexture_6fb992cdbb52b8a5(arg0, arg1) {
    arg0.texture = arg1;
};

export function __wbg_settexture_c85cb80ac44bcbae(arg0, arg1) {
    arg0.texture = arg1;
};

export function __wbg_settimestampwrites_f901bc9c89140525(arg0, arg1) {
    arg0.timestampWrites = arg1;
};

export function __wbg_settopology_b8997cc1c9b712d6(arg0, arg1) {
    arg0.topology = __wbindgen_enum_GpuPrimitiveTopology[arg1];
};

export function __wbg_settype_2a902a4a235bb64a(arg0, arg1, arg2) {
    arg0.type = getStringFromWasm0(arg1, arg2);
};

export function __wbg_settype_2eb0a1e4095d484d(arg0, arg1) {
    arg0.type = __wbindgen_enum_GpuSamplerBindingType[arg1];
};

export function __wbg_settype_39ed370d3edd403c(arg0, arg1, arg2) {
    arg0.type = getStringFromWasm0(arg1, arg2);
};

export function __wbg_settype_586408d828cb05f9(arg0, arg1) {
    arg0.type = __wbindgen_enum_GpuBufferBindingType[arg1];
};

export function __wbg_setusage_17dbbdcf9b98486f(arg0, arg1) {
    arg0.usage = arg1 >>> 0;
};

export function __wbg_setusage_a9a9e2b9822110e6(arg0, arg1) {
    arg0.usage = arg1 >>> 0;
};

export function __wbg_setusage_b974ee6a11b1c075(arg0, arg1) {
    arg0.usage = arg1 >>> 0;
};

export function __wbg_setusage_d29f3f1da20c479f(arg0, arg1) {
    arg0.usage = arg1 >>> 0;
};

export function __wbg_setvalue_6ad9ef6c692ea746(arg0, arg1, arg2) {
    arg0.value = getStringFromWasm0(arg1, arg2);
};

export function __wbg_setvertex_a2070ea015bc740c(arg0, arg1) {
    arg0.vertex = arg1;
};

export function __wbg_setview_0a3c9eb003dca615(arg0, arg1) {
    arg0.view = arg1;
};

export function __wbg_setview_a25d3a35a9550c37(arg0, arg1) {
    arg0.view = arg1;
};

export function __wbg_setviewdimension_62541381052220ba(arg0, arg1) {
    arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
};

export function __wbg_setviewdimension_cba6f4f08621ab93(arg0, arg1) {
    arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
};

export function __wbg_setviewformats_0e7d17b7af990229(arg0, arg1) {
    arg0.viewFormats = arg1;
};

export function __wbg_setviewformats_eacce800a57f29d1(arg0, arg1) {
    arg0.viewFormats = arg1;
};

export function __wbg_setvisibility_3f5ec62f823cc88e(arg0, arg1) {
    arg0.visibility = arg1 >>> 0;
};

export function __wbg_setwidth_374c62c8c467dd55(arg0, arg1) {
    arg0.width = arg1 >>> 0;
};

export function __wbg_setwidth_660ca581e3fbe279(arg0, arg1) {
    arg0.width = arg1 >>> 0;
};

export function __wbg_setwidth_c5fed9f5e7f0b406(arg0, arg1) {
    arg0.width = arg1 >>> 0;
};

export function __wbg_setwritemask_a015d982c216f05a(arg0, arg1) {
    arg0.writeMask = arg1 >>> 0;
};

export function __wbg_setx_744e248c289894b0(arg0, arg1) {
    arg0.x = arg1 >>> 0;
};

export function __wbg_setx_bed4341c6692c1fa(arg0, arg1) {
    arg0.x = arg1 >>> 0;
};

export function __wbg_sety_3739f1c9f8e4fe38(arg0, arg1) {
    arg0.y = arg1 >>> 0;
};

export function __wbg_sety_d1def1c7baef049a(arg0, arg1) {
    arg0.y = arg1 >>> 0;
};

export function __wbg_setz_a1e821c7a1a291c5(arg0, arg1) {
    arg0.z = arg1 >>> 0;
};

export function __wbg_shaderSource_72d3e8597ef85b67(arg0, arg1, arg2, arg3) {
    arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
};

export function __wbg_shaderSource_ad0087e637a35191(arg0, arg1, arg2, arg3) {
    arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
};

export function __wbg_shiftKey_2bebb3b703254f47(arg0) {
    const ret = arg0.shiftKey;
    return ret;
};

export function __wbg_shiftKey_86e737105bab1a54(arg0) {
    const ret = arg0.shiftKey;
    return ret;
};

export function __wbg_size_3808d41635a9c259(arg0) {
    const ret = arg0.size;
    return ret;
};

export function __wbg_size_f5fdd7af88b0b724(arg0) {
    const ret = arg0.size;
    return ret;
};

export function __wbg_stack_0b83281de580e52f(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_static_accessor_GLOBAL_88a902d13a557d07() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_37c5d418e4bf5819() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_5de37043a91a9c40() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_stencilFuncSeparate_91700dcf367ae07e(arg0, arg1, arg2, arg3, arg4) {
    arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
};

export function __wbg_stencilFuncSeparate_c1a6fa2005ca0aaf(arg0, arg1, arg2, arg3, arg4) {
    arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
};

export function __wbg_stencilMaskSeparate_4f1a2defc8c10956(arg0, arg1, arg2) {
    arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_stencilMaskSeparate_f8a0cfb5c2994d4a(arg0, arg1, arg2) {
    arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_stencilMask_1e602ef63f5b4144(arg0, arg1) {
    arg0.stencilMask(arg1 >>> 0);
};

export function __wbg_stencilMask_cd8ca0a55817e599(arg0, arg1) {
    arg0.stencilMask(arg1 >>> 0);
};

export function __wbg_stencilOpSeparate_1fa08985e79e1627(arg0, arg1, arg2, arg3, arg4) {
    arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_stencilOpSeparate_ff6683bbe3838ae6(arg0, arg1, arg2, arg3, arg4) {
    arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_stopPropagation_11d220a858e5e0fb(arg0) {
    arg0.stopPropagation();
};

export function __wbg_style_fb30c14e5815805c(arg0) {
    const ret = arg0.style;
    return ret;
};

export function __wbg_subarray_aa9065fa9dc5df96(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_submit_683667e8c0f18d76(arg0, arg1) {
    arg0.submit(arg1);
};

export function __wbg_texImage2D_57483314967bdd11() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texImage2D_5f2835f02b1d1077() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texImage2D_b8edcb5692f65f88() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texImage3D_921b54d09bf45af0() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    arg0.texImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8 >>> 0, arg9 >>> 0, arg10);
}, arguments) };

export function __wbg_texImage3D_a00b7a4df48cf757() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    arg0.texImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8 >>> 0, arg9 >>> 0, arg10);
}, arguments) };

export function __wbg_texParameteri_8112b26b3c360b7e(arg0, arg1, arg2, arg3) {
    arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};

export function __wbg_texParameteri_ef50743cb94d507e(arg0, arg1, arg2, arg3) {
    arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};

export function __wbg_texStorage2D_fbda848497f3674e(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.texStorage2D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_texStorage3D_fd7a7ca30e7981d1(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.texStorage3D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5, arg6);
};

export function __wbg_texSubImage2D_061605071aad9d2c() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_aa9a084093764796() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_c7951ed97252bdff() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_d52d1a0d3654c60b() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_dd9cac68ad5fe0b6() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_e6d34f5bb062e404() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_f39ea52a2d4bd2f7() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_fbdf91268228c757() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage3D_04731251d7cecc83() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_37f0045d16871670() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_3a871f6405d2f183() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_66acd67f56e3b214() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_a051de089266fa1b() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_b28c55f839bbec41() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_f18bf091cd48774c() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_then_44b73946d2fb3e7d(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
};

export function __wbg_then_48b406749878a531(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
};

export function __wbg_top_ec9fceb1f030f2ea(arg0) {
    const ret = arg0.top;
    return ret;
};

export function __wbg_touches_6831ee0099511603(arg0) {
    const ret = arg0.touches;
    return ret;
};

export function __wbg_type_00566e0d2e337e2e(arg0, arg1) {
    const ret = arg1.type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_type_20c7c49b2fbe0023(arg0, arg1) {
    const ret = arg1.type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_uniform1f_21390b04609a9fa5(arg0, arg1, arg2) {
    arg0.uniform1f(arg1, arg2);
};

export function __wbg_uniform1f_dc009a0e7f7e5977(arg0, arg1, arg2) {
    arg0.uniform1f(arg1, arg2);
};

export function __wbg_uniform1i_5ddd9d8ccbd390bb(arg0, arg1, arg2) {
    arg0.uniform1i(arg1, arg2);
};

export function __wbg_uniform1i_ed95b6129dce4d84(arg0, arg1, arg2) {
    arg0.uniform1i(arg1, arg2);
};

export function __wbg_uniform1ui_66e092b67a21c84d(arg0, arg1, arg2) {
    arg0.uniform1ui(arg1, arg2 >>> 0);
};

export function __wbg_uniform2fv_656fce9525420996(arg0, arg1, arg2, arg3) {
    arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform2fv_d8bd2a36da7ce440(arg0, arg1, arg2, arg3) {
    arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform2iv_4d39fc5a26f03f55(arg0, arg1, arg2, arg3) {
    arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform2iv_e967139a28017a99(arg0, arg1, arg2, arg3) {
    arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform2uiv_4c340c9e8477bb07(arg0, arg1, arg2, arg3) {
    arg0.uniform2uiv(arg1, getArrayU32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3fv_7d828b7c4c91138e(arg0, arg1, arg2, arg3) {
    arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3fv_8153c834ce667125(arg0, arg1, arg2, arg3) {
    arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3iv_58662d914661aa10(arg0, arg1, arg2, arg3) {
    arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3iv_f30d27ec224b4b24(arg0, arg1, arg2, arg3) {
    arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3uiv_38673b825dc755f6(arg0, arg1, arg2, arg3) {
    arg0.uniform3uiv(arg1, getArrayU32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4f_36b8f9be15064aa7(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
};

export function __wbg_uniform4f_f7ea07febf8b5108(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
};

export function __wbg_uniform4fv_8827081a7585145b(arg0, arg1, arg2, arg3) {
    arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4fv_c01fbc6c022abac3(arg0, arg1, arg2, arg3) {
    arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4iv_7fe05be291899f06(arg0, arg1, arg2, arg3) {
    arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4iv_84fdf80745e7ff26(arg0, arg1, arg2, arg3) {
    arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4uiv_9de55998fbfef236(arg0, arg1, arg2, arg3) {
    arg0.uniform4uiv(arg1, getArrayU32FromWasm0(arg2, arg3));
};

export function __wbg_uniformBlockBinding_18117f4bda07115b(arg0, arg1, arg2, arg3) {
    arg0.uniformBlockBinding(arg1, arg2 >>> 0, arg3 >>> 0);
};

export function __wbg_uniformMatrix2fv_98681e400347369c(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix2fv_bc019eb4784a3b8c(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix2x3fv_6421f8d6f7f4d144(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix2x3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix2x4fv_27d807767d7aadc6(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix2x4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix3fv_3d6ad3a1e0b0b5b6(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix3fv_3df529aab93cf902(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix3x2fv_79357317e9637d05(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix3x2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix3x4fv_9d1a88b5abfbd64b(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix3x4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix4fv_da94083874f202ad(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix4fv_e87383507ae75670(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix4x2fv_aa507d918a0b5a62(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix4x2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix4x3fv_6712c7a3b4276fb4(arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix4x3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_unmap_3996f949ebf6b9a4(arg0) {
    arg0.unmap();
};

export function __wbg_usage_ef79cc1301f4d456(arg0) {
    const ret = arg0.usage;
    return ret;
};

export function __wbg_useProgram_473bf913989b6089(arg0, arg1) {
    arg0.useProgram(arg1);
};

export function __wbg_useProgram_9b2660f7bb210471(arg0, arg1) {
    arg0.useProgram(arg1);
};

export function __wbg_userAgent_12e9d8e62297563f() { return handleError(function (arg0, arg1) {
    const ret = arg1.userAgent;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_value_91cbf0dd3ab84c1e(arg0, arg1) {
    const ret = arg1.value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_versions_c01dfd4722a88165(arg0) {
    const ret = arg0.versions;
    return ret;
};

export function __wbg_vertexAttribDivisorANGLE_11e909d332960413(arg0, arg1, arg2) {
    arg0.vertexAttribDivisorANGLE(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_vertexAttribDivisor_4d361d77ffb6d3ff(arg0, arg1, arg2) {
    arg0.vertexAttribDivisor(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_vertexAttribIPointer_d0c67543348c90ce(arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.vertexAttribIPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_vertexAttribPointer_550dc34903e3d1ea(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
};

export function __wbg_vertexAttribPointer_7a2a506cdbe3aebc(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
};

export function __wbg_videoHeight_3a43327a766c1f03(arg0) {
    const ret = arg0.videoHeight;
    return ret;
};

export function __wbg_videoWidth_4b400cf6f4744a4d(arg0) {
    const ret = arg0.videoWidth;
    return ret;
};

export function __wbg_viewport_a1b4d71297ba89af(arg0, arg1, arg2, arg3, arg4) {
    arg0.viewport(arg1, arg2, arg3, arg4);
};

export function __wbg_viewport_e615e98f676f2d39(arg0, arg1, arg2, arg3, arg4) {
    arg0.viewport(arg1, arg2, arg3, arg4);
};

export function __wbg_warn_4ca3906c248c47c4(arg0) {
    console.warn(arg0);
};

export function __wbg_warn_546be8a35b05ef9a(arg0, arg1) {
    console.warn(getStringFromWasm0(arg0, arg1));
};

export function __wbg_width_4f334fc47ef03de1(arg0) {
    const ret = arg0.width;
    return ret;
};

export function __wbg_width_5dde457d606ba683(arg0) {
    const ret = arg0.width;
    return ret;
};

export function __wbg_width_8fe4e8f77479c2a6(arg0) {
    const ret = arg0.width;
    return ret;
};

export function __wbg_width_b0c1d9f437a95799(arg0) {
    const ret = arg0.width;
    return ret;
};

export function __wbg_width_cdaf02311c1621d1(arg0) {
    const ret = arg0.width;
    return ret;
};

export function __wbg_width_f54c7178d3c78f16(arg0) {
    const ret = arg0.width;
    return ret;
};

export function __wbg_writeBuffer_54f5faed442e5ab3() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.writeBuffer(arg1, arg2, arg3, arg4, arg5);
}, arguments) };

export function __wbg_writeText_51c338e8ae4b85b9(arg0, arg1, arg2) {
    const ret = arg0.writeText(getStringFromWasm0(arg1, arg2));
    return ret;
};

export function __wbg_writeTexture_c90c50e5c2a97ff0() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.writeTexture(arg1, arg2, arg3, arg4);
}, arguments) };

export function __wbg_write_e357400b06c0ccf5(arg0, arg1) {
    const ret = arg0.write(arg1);
    return ret;
};

export function __wbindgen_as_number(arg0) {
    const ret = +arg0;
    return ret;
};

export function __wbindgen_boolean_get(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

export function __wbindgen_cb_drop(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export function __wbindgen_closure_wrapper11351(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 3098, __wbg_adapter_52);
    return ret;
};

export function __wbindgen_closure_wrapper1754(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 500, __wbg_adapter_44);
    return ret;
};

export function __wbindgen_closure_wrapper1756(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 500, __wbg_adapter_47);
    return ret;
};

export function __wbindgen_closure_wrapper1758(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 500, __wbg_adapter_44);
    return ret;
};

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbindgen_in(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_1;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_is_function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

export function __wbindgen_is_null(arg0) {
    const ret = arg0 === null;
    return ret;
};

export function __wbindgen_is_object(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbindgen_is_string(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbindgen_jsval_loose_eq(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return ret;
};

export function __wbindgen_number_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

